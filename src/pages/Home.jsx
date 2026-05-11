// src/pages/Home.jsx
// Home page — shows popular anime, movies, and books fetched from APIs.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import { fetchTopAnime, normalizeAnime } from '../hooks/useJikan'
import { fetchTrendingMovies, normalizeMovie } from '../hooks/useTMDB'
import { fetchPopularBooks, normalizeBook } from '../hooks/useGoogleBooks'
import { useAuth } from '../hooks/useAuth'
import { useUserLibrary } from '../hooks/useLibrary'
import { t } from '../lib/i18n'

export default function Home() {
  const { user }                                = useAuth()
  const { entries }                             = useUserLibrary(user?.id)
  const navigate                                = useNavigate()

  const [anime,   setAnime]   = useState([])
  const [movies,  setMovies]  = useState([])
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      try {
        const [animeData, movieData, bookData] = await Promise.all([
          fetchTopAnime(8),
          fetchTrendingMovies(8),
          fetchPopularBooks('fiction', 8),
        ])
        setAnime(animeData.map(normalizeAnime))
        setMovies(movieData.map(normalizeMovie))
        setBooks(bookData.map(normalizeBook))
      } catch (e) {
        console.error('Home load error:', e)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // Build a map of mediaId → status from user's library for badge display
  const libraryMap = {}
  entries.forEach(e => {
    libraryMap[e.media_id] = e.status
  })

  // In-progress entries for "Continue Watching" section
  const inProgress = entries
    .filter(e => e.status === 'watching')
    .slice(0, 8)

  if (loading) return <div className="loading-text">{t.loading}</div>

  return (
    <div>

      {/* ── Continue Watching (only when logged in and has entries) ── */}
      {user && inProgress.length > 0 && (
        <Section title={t.recentActivity} link="/library">
          <div className="media-grid">
            {inProgress.map(entry => (
              <MediaCard
                key={entry.id}
                media={{ ...entry.media, externalId: entry.media.external_id }}
                entryStatus={entry.status}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ── Popular Anime ── */}
      <Section title={t.popularAnime} link="/search?type=anime">
        <div className="media-grid">
          {anime.map(a => (
            <MediaCard
              key={a.externalId}
              media={a}
              entryStatus={libraryMap[`anime-${a.externalId}`]}
            />
          ))}
        </div>
      </Section>

      {/* ── Popular Movies ── */}
      <Section title={t.popularMovies} link="/search?type=film">
        <div className="media-grid">
          {movies.map(m => (
            <MediaCard
              key={m.externalId}
              media={m}
              entryStatus={libraryMap[`film-${m.externalId}`]}
            />
          ))}
        </div>
      </Section>

      {/* ── Popular Books ── */}
      <Section title={t.popularBooks} link="/search?type=libro">
        <div className="media-grid">
          {books.map(b => (
            <MediaCard
              key={b.externalId}
              media={b}
              entryStatus={libraryMap[`libro-${b.externalId}`]}
            />
          ))}
        </div>
      </Section>

    </div>
  )
}

// ── Helper sub-component ──────────────────────────────────────
function Section({ title, link, children }) {
  const navigate = useNavigate()
  return (
    <div className="section-block">
      <div className="section-header">
        <span>{title}</span>
        {link && (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate(link)}>
            {t.viewAll}
          </span>
        )}
      </div>
      <div className="section-body">{children}</div>
    </div>
  )
}
