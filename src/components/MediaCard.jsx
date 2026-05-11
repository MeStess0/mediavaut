// src/components/MediaCard.jsx
// Reusable card for displaying any media type in a grid.
// Clicking the card navigates to the detail page.

import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { t } from '../lib/i18n'

// Map our internal type keys to display labels
const TYPE_LABELS = {
  anime:    t.anime,
  manga:    t.manga,
  film:     t.movie,
  serie_tv: t.tvSeries,
  libro:    t.book,
}

export default function MediaCard({ media, entryStatus, onClick }) {
  const navigate = useNavigate()

  // `media` can come from an external API (already normalized)
  // or from the database (media.type, media.title, etc.)
  const cover      = media.cover      || media.cover_url
  const title      = media.title
  const type       = media.type
  const score      = media.score
  const externalId = media.externalId || media.external_id

  const handleClick = () => {
    if (onClick) {
      onClick(media)
      return
    }
    // Navigate to detail page: /media/anime/16498
    navigate(`/media/${type}/${externalId}`)
  }

  return (
    <div className="media-card" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}>

      {/* Cover image */}
      {cover
        ? <img className="media-card-cover" src={cover} alt={title} loading="lazy" />
        : <div className="media-card-cover-placeholder">{title}</div>
      }

      <div className="media-card-info">
        {/* Media type badge */}
        <div className="media-type-badge">{TYPE_LABELS[type] || type}</div>

        {/* Title */}
        <div className="media-card-title" title={title}>{title}</div>

        {/* Score from external API */}
        {score && <div className="media-card-score">{Number(score).toFixed(1)}</div>}

        {/* Status badge — only shown if the card is in the user's library */}
        {entryStatus && <div style={{ marginTop: 4 }}><StatusBadge status={entryStatus} /></div>}
      </div>
    </div>
  )
}
