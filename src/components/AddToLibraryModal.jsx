// src/components/AddToLibraryModal.jsx
// Modal for adding or editing a media entry in the user's library.

import { useState } from 'react'
import { t } from '../lib/i18n'

const STATUSES = [
  { key: 'watching',  label: t.watching  },
  { key: 'completed', label: t.completed },
  { key: 'planned',   label: t.planned   },
  { key: 'dropped',   label: t.dropped   },
]

export default function AddToLibraryModal({ media, existingEntry, onSave, onRemove, onClose }) {
  const [status,   setStatus]   = useState(existingEntry?.status   || 'planned')
  const [progress, setProgress] = useState(existingEntry?.progress || 0)
  const [rating,   setRating]   = useState(existingEntry?.rating   || '')
  const [review,   setReview]   = useState(existingEntry?.review   || '')
  const [saving,   setSaving]   = useState(false)

  const maxProgress = media.maxProgress || media.extra_data?.maxProgress || null

  const progressLabel = () => {
    if (media.type === 'anime' || media.type === 'serie_tv') return t.episode
    if (media.type === 'manga')  return t.chapter
    if (media.type === 'libro')  return t.page
    return t.progress
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave({ status, progress: Number(progress), rating: rating ? Number(rating) : null, review })
    setSaving(false)
  }

  const handleRemove = async () => {
    if (!window.confirm(t.removeFromLibrary + '?')) return
    setSaving(true)
    await onRemove()
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span>{existingEntry ? t.editEntry : t.addToLibrary}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Media info header */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {(media.cover || media.cover_url) && (
              <img
                src={media.cover || media.cover_url}
                alt={media.title}
                style={{ width: 60, height: 85, objectFit: 'cover', flexShrink: 0 }}
              />
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{media.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {media.type}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">{t.status}</label>
            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Progress */}
          {media.type !== 'film' && (
            <div className="form-group">
              <label className="form-label">
                {progressLabel()} {maxProgress ? `(${t.of} ${maxProgress})` : ''}
              </label>
              <input
                type="number"
                className="form-input"
                min={0}
                max={maxProgress || undefined}
                value={progress}
                onChange={e => setProgress(e.target.value)}
              />
              {maxProgress && (
                <div className="progress-bar-wrap" style={{ marginTop: 6 }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, (progress / maxProgress) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Personal rating */}
          <div className="form-group">
            <label className="form-label">{t.yourRating} (1–10)</label>
            <input
              type="number"
              className="form-input"
              min={1} max={10} step={0.5}
              placeholder="—"
              value={rating}
              onChange={e => setRating(e.target.value)}
            />
          </div>

          {/* Personal review */}
          <div className="form-group">
            <label className="form-label">{t.yourReview}</label>
            <textarea
              className="form-textarea"
              placeholder={t.addReview}
              value={review}
              onChange={e => setReview(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          {existingEntry && (
            <button className="btn btn-danger btn-sm" onClick={handleRemove} disabled={saving}>
              {t.removeFromLibrary}
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? t.loading : t.save}
          </button>
        </div>
      </div>
    </div>
  )
}
