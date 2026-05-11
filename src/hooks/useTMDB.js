// src/hooks/useTMDB.js
// -----------------------------------------------------------
// All TMDB API calls (movies + TV series).
// Requires VITE_TMDB_KEY in your .env file.
// Get a free key at: https://www.themoviedb.org/settings/api
// -----------------------------------------------------------

import { useState } from 'react'

const BASE       = 'https://api.themoviedb.org/3'
export const IMG = 'https://image.tmdb.org/t/p/w500'   // image base URL
const KEY        = import.meta.env.VITE_TMDB_KEY

// ── Search hooks ─────────────────────────────────────────────

export function useMovieSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const search = async (query) => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${BASE}/search/movie?api_key=${KEY}&query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}

export function useTVSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const search = async (query) => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${BASE}/search/tv?api_key=${KEY}&query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}

// ── One-off fetch functions ───────────────────────────────────

export async function fetchMovieById(id) {
  const res = await fetch(`${BASE}/movie/${id}?api_key=${KEY}&append_to_response=credits,videos`)
  return await res.json()
}

export async function fetchTVById(id) {
  const res = await fetch(`${BASE}/tv/${id}?api_key=${KEY}&append_to_response=credits,videos`)
  return await res.json()
}

export async function fetchTrendingMovies(limit = 12) {
  const res  = await fetch(`${BASE}/trending/movie/week?api_key=${KEY}`)
  const data = await res.json()
  return (data.results || []).slice(0, limit)
}

export async function fetchTrendingTV(limit = 12) {
  const res  = await fetch(`${BASE}/trending/tv/week?api_key=${KEY}`)
  const data = await res.json()
  return (data.results || []).slice(0, limit)
}

// ── Normalizers ───────────────────────────────────────────────

export function normalizeMovie(m) {
  return {
    externalId:  String(m.id),
    type:        'film',
    title:       m.title || m.original_title,
    titleAlt:    m.original_title !== m.title ? m.original_title : '',
    cover:       m.poster_path ? IMG + m.poster_path : null,
    synopsis:    m.overview || '',
    score:       m.vote_average ? Number(m.vote_average.toFixed(1)) : null,
    status:      m.status || '',
    genres:      m.genres?.map(g => g.name) || [],
    year:        m.release_date?.slice(0, 4) || null,
    runtime:     m.runtime || null,
    director:    m.credits?.crew?.find(c => c.job === 'Director')?.name || null,
    url:         `https://www.themoviedb.org/movie/${m.id}`,
    maxProgress: 1,  // a movie is either watched (1) or not (0)
  }
}

export function normalizeTV(s) {
  return {
    externalId:  String(s.id),
    type:        'serie_tv',
    title:       s.name || s.original_name,
    titleAlt:    s.original_name !== s.name ? s.original_name : '',
    cover:       s.poster_path ? IMG + s.poster_path : null,
    synopsis:    s.overview || '',
    score:       s.vote_average ? Number(s.vote_average.toFixed(1)) : null,
    status:      s.status || '',
    genres:      s.genres?.map(g => g.name) || [],
    year:        s.first_air_date?.slice(0, 4) || null,
    episodes:    s.number_of_episodes || null,
    seasons:     s.number_of_seasons || null,
    url:         `https://www.themoviedb.org/tv/${s.id}`,
    maxProgress: s.number_of_episodes || null,
  }
}
