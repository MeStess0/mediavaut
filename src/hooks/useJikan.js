// src/hooks/useJikan.js
// -----------------------------------------------------------
// All Jikan API calls (anime + manga).
// Jikan is a free unofficial MyAnimeList REST API.
// No API key needed. Base URL: https://api.jikan.moe/v4
// -----------------------------------------------------------

import { useState } from 'react'

const BASE = 'https://api.jikan.moe/v4'

// ── Search hooks ─────────────────────────────────────────────

export function useAnimeSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const search = async (query) => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${BASE}/anime?q=${encodeURIComponent(query)}&limit=20&sfw=true`)
      const data = await res.json()
      setResults(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}

export function useMangaSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const search = async (query) => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${BASE}/manga?q=${encodeURIComponent(query)}&limit=20&sfw=true`)
      const data = await res.json()
      setResults(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}

// ── One-off fetch functions (not hooks) ──────────────────────

export async function fetchAnimeById(id) {
  const res  = await fetch(`${BASE}/anime/${id}/full`)
  const data = await res.json()
  return data.data
}

export async function fetchMangaById(id) {
  const res  = await fetch(`${BASE}/manga/${id}/full`)
  const data = await res.json()
  return data.data
}

export async function fetchTopAnime(limit = 12) {
  const res  = await fetch(`${BASE}/top/anime?limit=${limit}`)
  const data = await res.json()
  return data.data || []
}

export async function fetchSeasonalAnime(limit = 12) {
  const res  = await fetch(`${BASE}/seasons/now?limit=${limit}`)
  const data = await res.json()
  return data.data || []
}

// ── Normalizers ───────────────────────────────────────────────
// Convert raw Jikan data to our standard media shape.
// This lets the rest of the app work with one consistent format.

export function normalizeAnime(a) {
  return {
    externalId: String(a.mal_id),
    type:        'anime',
    title:       a.title,
    titleAlt:    a.title_english || a.title_japanese || '',
    cover:       a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || null,
    synopsis:    a.synopsis || '',
    score:       a.score || null,
    status:      a.status || '',
    episodes:    a.episodes || null,
    genres:      a.genres?.map(g => g.name) || [],
    year:        a.year || null,
    season:      a.season || null,
    studio:      a.studios?.[0]?.name || null,
    url:         a.url || null,
    maxProgress: a.episodes || null,  // used for progress tracking
  }
}

export function normalizeManga(m) {
  return {
    externalId: String(m.mal_id),
    type:        'manga',
    title:       m.title,
    titleAlt:    m.title_english || m.title_japanese || '',
    cover:       m.images?.jpg?.large_image_url || m.images?.jpg?.image_url || null,
    synopsis:    m.synopsis || '',
    score:       m.score || null,
    status:      m.status || '',
    chapters:    m.chapters || null,
    volumes:     m.volumes || null,
    genres:      m.genres?.map(g => g.name) || [],
    authors:     m.authors?.map(a => a.name) || [],
    url:         m.url || null,
    maxProgress: m.chapters || null,
  }
}
