// src/components/Sidebar.jsx
// Left sidebar with media type filter and quick stats.

import { useNavigate, useSearchParams } from 'react-router-dom'
import { t } from '../lib/i18n'
import { useAuth } from '../hooks/useAuth'
import { useLibraryStats } from '../hooks/useLibrary'

const MEDIA_TYPES = [
  { key: '',         label: t.all      },
  { key: 'anime',    label: t.anime    },
  { key: 'manga',    label: t.manga    },
  { key: 'film',     label: t.movie    },
  { key: 'serie_tv', label: t.tvSeries },
  { key: 'libro',    label: t.book     },
]

export default function Sidebar({ activeType, onTypeChange }) {
  const navigate       = useNavigate()
  const { user }       = useAuth()
  const stats          = useLibraryStats(user?.id)

  return (
    <aside className="sidebar">

      {/* Media type filter */}
      <div className="sidebar-section">
        <div className="sidebar-title">{t.kindOfMedia}</div>
        {MEDIA_TYPES.map(({ key, label }) => (
          <button
            key={key}
            className={`sidebar-item ${activeType === key ? 'active' : ''}`}
            onClick={() => onTypeChange ? onTypeChange(key) : navigate(`/search?type=${key}`)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Quick stats — only shown when logged in */}
      {user && (
        <div className="sidebar-section">
          <div className="sidebar-title">{t.myStats}</div>
          <div style={{ padding: '8px 10px' }}>
            <StatRow label={t.total}     value={stats.total}     />
            <StatRow label={t.watching}  value={stats.watching}  />
            <StatRow label={t.completed} value={stats.completed} />
            <StatRow label={t.planned}   value={stats.planned}   />
            <StatRow label={t.dropped}   value={stats.dropped}   />
          </div>
        </div>
      )}

    </aside>
  )
}

function StatRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0',
                  fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
