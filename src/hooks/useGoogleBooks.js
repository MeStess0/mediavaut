// src/hooks/useGoogleBooks.js
// -----------------------------------------------------------
// All Google Books API calls.
// The key is optional — without it you get 1000 req/day
// (more than enough for personal use).
// Get a free key at: https://console.cloud.google.com
// -----------------------------------------------------------

import { useState } from 'react'

const BASE = 'https://www.googleapis.com/books/v1'
const KEY  = import.meta.env.VITE_GOOGLE_BOOKS_KEY  // optional

function buildUrl(path, params = {}) {
  const url = new URL(BASE + path)
  if (KEY) url.searchParams.set('key', KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return url.toString()
}

// ── Search hook ───────────────────────────────────────────────

export function useBookSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const search = async (query) => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(buildUrl('/volumes', { q: query, maxResults: 20 }))
      const data = await res.json()
      setResults(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}

// ── One-off fetch functions ───────────────────────────────────

export async function fetchBookById(id) {
  const res = await fetch(buildUrl(`/volumes/${id}`))
  return await res.json()
}

export async function fetchPopularBooks(subject = 'fiction', limit = 12) {
  const res  = await fetch(buildUrl('/volumes', { q: `subject:${subject}`, maxResults: limit }))
  const data = await res.json()
  return data.items || []
}

// ── Normalizer ────────────────────────────────────────────────

export function normalizeBook(b) {
  const info = b.volumeInfo || {}
  return {
    externalId:  b.id,
    type:        'libro',
    title:       info.title || 'Unknown title',
    titleAlt:    info.subtitle || '',
    cover:       info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
    synopsis:    info.description || '',
    score:       info.averageRating ? info.averageRating * 2 : null, // 5-scale → 10-scale
    genres:      info.categories || [],
    authors:     info.authors || [],
    year:        info.publishedDate?.slice(0, 4) || null,
    pages:       info.pageCount || null,
    publisher:   info.publisher || null,
    isbn:        info.industryIdentifiers?.[0]?.identifier || null,
    url:         info.infoLink || null,
    maxProgress: info.pageCount || null,
  }
}
