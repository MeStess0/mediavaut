// src/pages/Library.jsx
// The user's personal library — filterable by status and media type.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUserLibrary, useLibraryStats } from '../hooks/useLibrary'
import StatusBadge from '../components/StatusBadge'
import { t } from '../lib/i18n'

const STATUSES = [
  { key: '',          label: t.all       },
  { key: 'watching',  label: t.watching  },
  { key: 'completed', label: t.completed },
  { key: 'planned',   label: t.planned   },
  { key: 'dropped',   label: t.dropped   },
]

const TYPES = [
  { key: '',         label: t.all       },
  { key: 'anime',    label: t.anime     },
  { key: 'manga',    label: t.manga     },
  { key: 'film',     label: t.movie     },
  { key: 'serie_tv', label: t.tvSeries  },
  { key: 'libro',    label: t.book      },
]

export default function Library() {
  const { user }              = useAuth()
  const { entries, loading }  = useUserLibrary(user?.id)
  const stats                 = useLibraryStats(user?.id)
  const navigate              = useNavigate()

  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter,   setTypeFilter]   = useState('')

  if (!user) {
    return (
      <div className="empty-state">
        <h3>{t.login}</h3>
        <p style={{ marginTop: 8 }}>
          <a href="/login" className="btn btn-primary btn-sm">{t.login}</a>
        </p>
      </div>
    )
  }

  if (loading) return <div className="loading-text">{t.loading}</div>

  // Apply filters
  const filtered = entries.filter(e => {
    const statusOk = !statusFilter || e.status === statusFilter
    const typeOk   = !typeFilter   || e.media?.type === typeFilter
    return statusOk && typeOk
  })

  const progressLabel = (type) => {
    if (type === 'anime' || type === 'serie_tv') return t.episode
    if (type === 'manga')  return t.chapter
    if (type === 'libro')  return t.page
    return ''
  }

  return (
    <div>
      {/* Stats row */}
      <div className="stats-row">
        <StatCard value={stats.total}     label={t.total}     />
        <StatCard value={stats.watching}  label={t.watching}  />
        <StatCard value={stats.completed} label={t.completed} />
        <StatCard value={stats.planned}   label={t.planned}   />
        <StatCard value={stats.dropped}   label={t.dropped}   />
      </div>

      {/* Filter section */}
      <div className="section-block">
        <div className="section-header"><span>{t.myLibrary}</span></div>
        <div className="section-body">

          {/* Status tabs */}
          <div className="tabs">
            {STATUSES.map(s => (
              <button
                key={s.key}
                className={`tab-btn ${statusFilter === s.key ? 'active' : ''}`}
                onClick={() => setStatusFilter(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.kindOfMedia}:</label>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              {TYPES.map(tp => (
                <option key={tp.key} value={tp.key}>{tp.label}</option>
              ))}
            </select>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>{t.noEntriesYet}</h3>
              <p>{t.startAdding}</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}
                onClick={() => navigate('/search')}>
                {t.search}
              </button>
            </div>
          )}

          {/* Entries list */}
          {filtered.map(entry => {
            const media      = entry.media || {}
            const maxProg    = media.extra_data?.maxProgress
            const coverUrl   = media.cover_url

            return (
              <div
                key={entry.id}
                className="library-row"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/media/${media.type}/${media.external_id}`)}
              >
                {/* Cover */}
                {coverUrl
                  ? <img className="library-row-cover" src={coverUrl} alt={media.title} />
                  : <div className="library-row-cover" style={{ background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: 'var(--text-muted)', padding: 4, textAlign: 'center' }}>
                      {media.title}
                    </div>
                }

                {/* Info */}
                <div className="library-row-info">
                  <div className="library-row-title">{media.title}</div>
                  <div className="library-row-meta">
                    <StatusBadge status={entry.status} />
                    {' '}
                    {media.type && (
                      <span style={{ textTransform: 'uppercase', fontSize: 10,
                        color: 'var(--text-muted)', marginLeft: 4 }}>
                        {media.type}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {media.type !== 'film' && maxProg && entry.progress !== undefined && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
                        {progressLabel(media.type)} {entry.progress} {t.of} {maxProg}
                      </div>
                      <div className="progress-bar-wrap">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${Math.min(100, (entry.progress / maxProg) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating */}
                {entry.rating && (
                  <div style={{ flexShrink: 0, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
                      ★ {entry.rating}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.yourRating}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
