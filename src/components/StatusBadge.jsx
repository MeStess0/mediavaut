// src/components/StatusBadge.jsx
// A small coloured pill that shows the tracking status of a media entry.

import { t } from '../lib/i18n'

// Map database status values to translation keys
const STATUS_LABELS = {
  watching:  t.watching,
  completed: t.completed,
  planned:   t.planned,
  dropped:   t.dropped,
}

export default function StatusBadge({ status }) {
  if (!status) return null
  return (
    <span className={`status-badge ${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
