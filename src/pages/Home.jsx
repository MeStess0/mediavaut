// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaCard from "../components/MediaCard";
import {
  fetchSeasonalAnime,
  fetchTopAnime,
  normalizeAnime,
  normalizeManga,
} from "../hooks/useJikan";
import {
  fetchTrendingMovies,
  fetchTrendingTV,
  normalizeMovie,
  normalizeTV,
} from "../hooks/useTMDB";
import { useAuth } from "../hooks/useAuth";
import { useUserLibrary } from "../hooks/useLibrary";
import { t } from "../lib/i18n";

export default function Home() {
  const { user } = useAuth();
  const { entries } = useUserLibrary(user?.id);
  const navigate = useNavigate();

  const [anime, setAnime] = useState([]);
  const [manga, setManga] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tv, setTv] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [animeData, movieData, tvData] = await Promise.all([
          fetchSeasonalAnime(8),
          fetchTrendingMovies(8),
          fetchTrendingTV(8),
        ]);
        setAnime(animeData.map(normalizeAnime));
        setMovies(movieData.map(normalizeMovie));
        setTv(tvData.map(normalizeTV));
      } catch (e) {
        console.error("Home load error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const libraryMap = {};
  entries.forEach((e) => {
    libraryMap[e.media_id] = e.status;
  });

  const inProgress = entries.filter((e) => e.status === "watching").slice(0, 8);

  if (loading) return <div className="loading-text">{t.loading}</div>;

  return (
    <div>
      {user && inProgress.length > 0 && (
        <Section title={t.recentActivity} link="/library">
          <div className="media-grid">
            {inProgress.map((entry) => (
              <MediaCard
                key={entry.id}
                media={{ ...entry.media, externalId: entry.media.external_id }}
                entryStatus={entry.status}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Currently Airing Anime" link="/search?type=anime">
        <div className="media-grid">
          {anime.map((a) => (
            <MediaCard
              key={a.externalId}
              media={a}
              entryStatus={libraryMap[`anime-${a.externalId}`]}
            />
          ))}
        </div>
      </Section>

      <Section title="Trending Movies" link="/search?type=film">
        <div className="media-grid">
          {movies.map((m) => (
            <MediaCard
              key={m.externalId}
              media={m}
              entryStatus={libraryMap[`film-${m.externalId}`]}
            />
          ))}
        </div>
      </Section>

      <Section title="Trending TV Series" link="/search?type=serie_tv">
        <div className="media-grid">
          {tv.map((s) => (
            <MediaCard
              key={s.externalId}
              media={s}
              entryStatus={libraryMap[`serie_tv-${s.externalId}`]}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, link, children }) {
  const navigate = useNavigate();
  return (
    <div className="section-block">
      <div className="section-header">
        <span>{title}</span>
        {link && (
          <span style={{ cursor: "pointer" }} onClick={() => navigate(link)}>
            {t.viewAll}
          </span>
        )}
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}
