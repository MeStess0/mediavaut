// src/hooks/useLibrary.js
// -----------------------------------------------------------
// All database operations for the user's personal library.
// Uses two tables:
//   `media`         — cache of data fetched from external APIs
//   `tracked_media` — the user's personal entries (status, progress, rating)
// -----------------------------------------------------------

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ── Helper: generate a stable media ID ───────────────────────
// e.g. "anime-16498", "film-550", "libro-xyz123"
function makeMediaId(type, externalId) {
  return `${type}-${externalId}`
}

// ── Add a media entry to the library ─────────────────────────
export async function addToLibrary({ userId, media, status = 'planned', progress = 0 }) {
  const mediaId = makeMediaId(media.type, media.externalId)

  // 1. Upsert media into cache table (safe to call multiple times)
  const { error: mediaError } = await supabase.from('media').upsert({
    id:          mediaId,
    type:        media.type,
    title:       media.title,
    cover_url:   media.cover,
    synopsis:    media.synopsis,
    external_id: media.externalId,
    extra_data: {
      score:       media.score,
      genres:      media.genres,
      episodes:    media.episodes,
      chapters:    media.chapters,
      pages:       media.pages,
      volumes:     media.volumes,
      year:        media.year,
      url:         media.url,
      maxProgress: media.maxProgress,
      titleAlt:    media.titleAlt,
      studio:      media.studio,
      authors:     media.authors,
      director:    media.director,
      runtime:     media.runtime,
      seasons:     media.seasons,
    },
  }, { onConflict: 'id' })

  if (mediaError) return { error: mediaError }

  // 2. Insert into user's tracked_media
  const { data, error } = await supabase
    .from('tracked_media')
    .insert({ user_id: userId, media_id: mediaId, status, progress })
    .select('*, media(*)')
    .single()

  return { data, error }
}

// ── Update a tracked_media entry ─────────────────────────────
export async function updateLibraryEntry(entryId, updates) {
  const { data, error } = await supabase
    .from('tracked_media')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', entryId)
    .select('*, media(*)')
    .single()

  return { data, error }
}

// ── Remove an entry ───────────────────────────────────────────
export async function removeFromLibrary(entryId) {
  const { error } = await supabase
    .from('tracked_media')
    .delete()
    .eq('id', entryId)

  return { error }
}

// ── Check if a specific media is in the user's library ────────
export async function getLibraryEntry(userId, type, externalId) {
  const mediaId = makeMediaId(type, externalId)
  const { data, error } = await supabase
    .from('tracked_media')
    .select('*, media(*)')
    .eq('user_id', userId)
    .eq('media_id', mediaId)
    .maybeSingle()   // returns null instead of error if not found

  return { data, error }
}

// ── Hook: user's full library ─────────────────────────────────
export function useUserLibrary(userId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchLibrary = async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('tracked_media')
      .select('*, media(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) setError(error.message)
    else setEntries(data || [])
    setLoading(false)
  }

  // Fetch on mount and whenever userId changes
  useEffect(() => { fetchLibrary() }, [userId])

  // Call `refresh()` after adding / removing / updating an entry
  const refresh = () => fetchLibrary()

  return { entries, loading, error, refresh }
}

// ── Hook: library stats ───────────────────────────────────────
export function useLibraryStats(userId) {
  const [stats, setStats] = useState({
    total: 0, watching: 0, completed: 0, planned: 0, dropped: 0,
  })

  useEffect(() => {
    if (!userId) return
    const fetch = async () => {
      const { data } = await supabase
        .from('tracked_media')
        .select('status')
        .eq('user_id', userId)

      if (data) {
        const s = { total: data.length, watching: 0, completed: 0, planned: 0, dropped: 0 }
        data.forEach(e => { if (s[e.status] !== undefined) s[e.status]++ })
        setStats(s)
      }
    }
    fetch()
  }, [userId])

  return stats
}

// ── Hook: public library for profile page ─────────────────────
export function usePublicLibrary(userId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('tracked_media')
      .select('*, media(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setEntries(data || [])
        setLoading(false)
      })
  }, [userId])

  return { entries, loading }
}
