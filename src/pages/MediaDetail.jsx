// src/pages/MediaDetail.jsx
// Detail page for any media type.
// Route: /media/:type/:id

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAnimeById,
  fetchMangaById,
  normalizeAnime,
  normalizeManga,
} from "../hooks/useJikan";
import {
  fetchMovieById,
  fetchTVById,
  normalizeMovie,
  normalizeTV,
} from "../hooks/useTMDB";
import { fetchBookById, normalizeBook } from "../hooks/useGoogleBooks";
import { useAuth } from "../hooks/useAuth";
import {
  addToLibrary,
  updateLibraryEntry,
  removeFromLibrary,
  getLibraryEntry,
} from "../hooks/useLibrary";
import AddToLibraryModal from "../components/AddToLibraryModal";
import StatusBadge from "../components/StatusBadge";
import { t } from "../lib/i18n";

export default function MediaDetail() {
  const { type, id } = useParams();
  const { user } = useAuth();

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entry, setEntry] = useState(null); // user's library entry
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false); // synopsis read more

  // Fetch media from external API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let raw, normalized;
        if (type === "anime") {
          raw = await fetchAnimeById(id);
          normalized = normalizeAnime(raw);
        }
        if (type === "manga") {
          raw = await fetchMangaById(id);
          normalized = normalizeManga(raw);
        }
        if (type === "film") {
          raw = await fetchMovieById(id);
          normalized = normalizeMovie(raw);
        }
        if (type === "serie_tv") {
          raw = await fetchTVById(id);
          normalized = normalizeTV(raw);
        }
        if (type === "libro") {
          raw = await fetchBookById(id);
          normalized = normalizeBook(raw);
        }
        setMedia(normalized);
      } catch (e) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, id]);

  // Check if media is in the user's library
  useEffect(() => {
    if (!user || !type || !id) return;
    getLibraryEntry(user.id, type, id).then(({ data }) => setEntry(data));
  }, [user, type, id]);

  // ── Modal save handler ────────────────────────────────────
  const handleSave = async (updates) => {
    if (!user || !media) return;
    if (entry) {
      // Update existing
      const { data } = await updateLibraryEntry(entry.id, updates);
      setEntry(data);
    } else {
      // Add new
      const { data } = await addToLibrary({
        userId: user.id,
        media,
        ...updates,
      });
      setEntry(data);
    }
    setShowModal(false);
  };

  const handleRemove = async () => {
    if (!entry) return;
    await removeFromLibrary(entry.id);
    setEntry(null);
    setShowModal(false);
  };

  // ── Render ────────────────────────────────────────────────
  if (loading) return <div className="loading-text">{t.loading}</div>;
  if (error || !media)
    return <div className="error-msg">{error || t.notFound}</div>;

  const synopsis = media.synopsis || t.noSynopsis;
  const shortSynopsis =
    synopsis.length > 500 ? synopsis.slice(0, 500) + "..." : synopsis;

  return (
    <div>
      <div className="section-block">
        <div className="section-header">
          <span>{media.title}</span>
          {entry && <StatusBadge status={entry.status} />}
        </div>

        <div className="section-body">
          <div className="detail-layout">
            {/* Cover */}
            <div className="detail-cover">
              {media.cover ? (
                <img src={media.cover} alt={media.title} />
              ) : (
                <div className="detail-cover-placeholder">{media.title}</div>
              )}

              {/* Add / Edit library button */}
              <div style={{ marginTop: 10 }}>
                {user ? (
                  <button
                    className={`btn ${entry ? "btn-secondary" : "btn-primary"}`}
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => setShowModal(true)}
                  >
                    {entry ? t.editEntry : t.addToLibrary}
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="btn btn-secondary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {t.loginToSave}
                  </a>
                )}
              </div>

              {/* External link */}
              {media.url && (
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{
                    marginTop: 8,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {t.externalLink} ↗
                </a>
              )}

              {/* User's progress if in library */}
              {entry && media.maxProgress && media.type !== "film" && (
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginBottom: 4,
                    }}
                  >
                    {t.progress}: {entry.progress} {t.of} {media.maxProgress}
                  </div>
                  <div className="progress-bar-wrap">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, (entry.progress / media.maxProgress) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* User rating */}
              {entry?.rating && (
                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    ★ {entry.rating}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {t.yourRating}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="detail-info">
              <div className="detail-title">{media.title}</div>
              {media.titleAlt && (
                <div className="detail-title-alt">{media.titleAlt}</div>
              )}

              {/* Score */}
              {media.score && (
                <div className="detail-score">
                  ★ {media.score}
                  <span>/ 10</span>
                </div>
              )}

              {/* Meta fields */}
              <div className="detail-meta">
                {media.year && <MetaItem label={t.year} value={media.year} />}
                {media.status && (
                  <MetaItem label={t.status} value={media.status} />
                )}
                {media.studio && (
                  <MetaItem label={t.studio} value={media.studio} />
                )}
                {media.director && (
                  <MetaItem label={t.director} value={media.director} />
                )}
                {media.episodes && (
                  <MetaItem label={t.episodes} value={media.episodes} />
                )}
                {media.chapters && (
                  <MetaItem label={t.chapters} value={media.chapters} />
                )}
                {media.volumes && (
                  <MetaItem label={t.volumes} value={media.volumes} />
                )}
                {media.pages && (
                  <MetaItem label={t.pages} value={media.pages} />
                )}
                {media.runtime && (
                  <MetaItem
                    label={t.runtime}
                    value={`${media.runtime} ${t.minutes}`}
                  />
                )}
                {media.seasons && (
                  <MetaItem label={t.seasons} value={media.seasons} />
                )}
                {media.authors?.length > 0 && (
                  <MetaItem label={t.author} value={media.authors.join(", ")} />
                )}
              </div>

              {/* Genres */}
              {media.genres?.length > 0 && (
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}
                  >
                    {t.genres}
                  </div>
                  <div className="detail-genres">
                    {media.genres.map((g) => (
                      <span key={g} className="genre-tag">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                  marginTop: 8,
                }}
              >
                {t.synopsis}
              </div>
              <div className="detail-synopsis">
                {expanded ? synopsis : shortSynopsis}
                {synopsis.length > 500 && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginLeft: 8 }}
                    onClick={() => setExpanded((p) => !p)}
                  >
                    {expanded ? t.readLess : t.readMore}
                  </button>
                )}
              </div>

              {/* User review */}
              {entry?.review && (
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}
                  >
                    {t.yourReview}
                  </div>
                  <div
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      padding: "10px 14px",
                      fontSize: 13,
                      lineHeight: 1.7,
                      borderRadius: 3,
                    }}
                  >
                    {entry.review}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <AddToLibraryModal
          media={media}
          existingEntry={entry}
          onSave={handleSave}
          onRemove={handleRemove}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="detail-meta-item">
      <strong>{label}: </strong>
      {value}
    </div>
  );
}
