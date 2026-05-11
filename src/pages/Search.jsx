// src/pages/Search.jsx
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import { useAnimeSearch, useMangaSearch, normalizeAnime, normalizeManga } from '../hooks/useJikan'
import { useMovieSearch, useTVSearch, normalizeMovie, normalizeTV } from '../hooks/useTMDB'
import { useBookSearch, normalizeBook } from '../hooks/useGoogleBooks'
import { useAuth } from '../hooks/useAuth'
import { useUserLibrary } from '../hooks/useLibrary'
import { t } from '../lib/i18n'

const TYPES = [
  { key: 'anime',    label: t.anime    },
  { key: 'manga',    label: t.manga    },
  { key: 'film',     label: t.movie    },
  { key: 'serie_tv', label: t.tvSeries },
  { key: 'libro',    label: t.book     },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialType  = searchParams.get('type') || 'anime'
  const initialQuery = searchParams.get('q')    || ''

  const [query,       setQuery]       = useState(initialQuery)
  const [activeType,  setActiveType]  = useState(initialType)
  const [inputVal,    setInputVal]    = useState(initialQuery)

  const { user }    = useAuth()
  const { entries } = useUserLibrary(user?.id)

  // All search hooks
  const anime   = useAnimeSearch()
  const manga   = useMangaSearch()
  const movies  = useMovieSearch()
  const tv      = useTVSearch()
  const books   = useBookSearch()

  // Dispatch search to the correct hook
  const runSearch = useCallback((q, type) => {
    if (!q.trim()) return
    if (type === 'anime')    anime.search(q)
    if (type === 'manga')    manga.search(q)
    if (type === 'film')     movies.search(q)
    if (type === 'serie_tv') tv.search(q)
    if (type === 'libro')    books.search(q)
  }, [])

  // Run on mount if there's a query in the URL
  useEffect(() => {
    if (initialQuery) runSearch(initialQuery, initialType)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = inputVal.trim()
    if (!q) return
    setQuery(q)
    setSearchParams({ q, type: activeType })
    runSearch(q, activeType)
  }

  const handleTypeChange = (type) => {
    setActiveType(type)
    if (query) {
      setSearchParams({ q: query, type })
      runSearch(query, type)
    }
  }

  // Get results for the active tab and normalize them
  const getResults = () => {
    if (activeType === 'anime')    return anime.results.map(normalizeAnime)
    if (activeType === 'manga')    return manga.results.map(normalizeManga)
    if (activeType === 'film')     return movies.results.map(normalizeMovie)
    if (activeType === 'serie_tv') return tv.results.map(normalizeTV)
    if (activeType === 'libro')    return books.results.map(normalizeBook)
    return []
  }

  const isLoading = () => {
    if (activeType === 'anime')    return anime.loading
    if (activeType === 'manga')    return manga.loading
    if (activeType === 'film')     return movies.loading
    if (activeType === 'serie_tv') return tv.loading
    if (activeType === 'libro')    return books.loading
    return false
  }

  const results = getResults()
  const loading = isLoading()

  // Build library map for status badges
  const libraryMap = {}
  entries.forEach(e => { libraryMap[e.media_id] = e.status })

  return (
    <div>
      {/* Search form */}
      <div className="section-block">
        <div className="section-header"><span>{t.search}</span></div>
        <div className="section-body">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              className="form-input"
              type="text"
              placeholder={t.searchPlaceholder}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              autoFocus
            />
            <button className="btn btn-primary" type="submit">{t.search}</button>
          </form>

          {/* Media type tabs */}
          <div className="tabs">
            {TYPES.map(({ key, label }) => (
              <button
                key={key}
                className={`tab-btn ${activeType === key ? 'active' : ''}`}
                onClick={() => handleTypeChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && <div className="loading-text">{t.searching}</div>}

      {!loading && query && results.length === 0 && (
        <div className="empty-state">
          <h3>{t.noResults}</h3>
          <p>"{query}"</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="section-block">
          <div className="section-header">
            <span>{t.results} ({results.length})</span>
          </div>
          <div className="section-body">
            <div className="media-grid">
              {results.map(media => (
                <MediaCard
                  key={media.externalId}
                  media={media}
                  entryStatus={libraryMap[`${media.type}-${media.externalId}`]}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
