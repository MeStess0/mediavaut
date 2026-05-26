// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { usePublicLibrary, useLibraryStats } from "../hooks/useLibrary";
import {
  useIsFollowing,
  useFollowing,
  followUser,
  unfollowUser,
} from "../hooks/useFollows";
import StatusBadge from "../components/StatusBadge";
import { t } from "../lib/i18n";

export default function Profile() {
  const { username } = useParams();
  const { user, profile: myProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();
      if (!data) setNotFound(true);
      else setProfileData(data);
      setLoading(false);
    };
    load();
  }, [username]);

  const { entries } = usePublicLibrary(profileData?.id);
  const stats = useLibraryStats(profileData?.id);
  const { isFollowing, setIsFollowing } = useIsFollowing(
    user?.id,
    profileData?.id,
  );
  const { following } = useFollowing(profileData?.id);

  const isOwnProfile = user && myProfile?.username === username;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFollow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFollowLoading(true);
    if (isFollowing) {
      await unfollowUser(user.id, profileData.id);
      setIsFollowing(false);
    } else {
      await followUser(user.id, profileData.id);
      setIsFollowing(true);
    }
    setFollowLoading(false);
  };

  if (authLoading || loading)
    return <div className="loading-text">{t.loading}</div>;
  if (notFound) return <div className="error-msg">{t.notFound}</div>;

  const initials = profileData.username[0].toUpperCase();
  const joinDate = new Date(profileData.created_at).toLocaleDateString();

  return (
    <div>
      {/* Profile header */}
      <div className="section-block">
        <div className="section-header">
          <span>{t.profile}</span>
        </div>
        <div className="section-body">
          <div className="profile-header">
            <div className="profile-avatar">
              {profileData.avatar_url ? (
                <img src={profileData.avatar_url} alt={profileData.username} />
              ) : (
                initials
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div className="profile-username">{profileData.username}</div>
              {profileData.bio && (
                <div className="profile-bio">{profileData.bio}</div>
              )}
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 6,
                }}
              >
                {t.memberSince}: {joinDate}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCopyLink}
              >
                {copied ? "✓ Copied!" : "🔗 Share"}
              </button>
              {!isOwnProfile && user && (
                <button
                  className={`btn btn-sm ${isFollowing ? "btn-secondary" : "btn-primary"}`}
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {isFollowing ? "Unfollow" : "+ Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <StatCard value={stats.total} label={t.total} />
        <StatCard value={stats.watching} label={t.watching} />
        <StatCard value={stats.completed} label={t.completed} />
        <StatCard value={stats.planned} label={t.planned} />
        <StatCard value={stats.dropped} label={t.dropped} />
      </div>

      {/* Friends section — only on own profile */}
      {isOwnProfile && (
        <div className="section-block">
          <div className="section-header">
            <span>Following ({following.length})</span>
          </div>
          <div className="section-body">
            {following.length === 0 && (
              <div className="empty-state">
                <p>
                  You're not following anyone yet. Share your profile link to
                  connect!
                </p>
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {following.map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate(`/profile/${f.username}`)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: "var(--bg-secondary)",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {f.username[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    {f.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Library */}
      <div className="section-block">
        <div className="section-header">
          <span>{t.myLibrary}</span>
        </div>
        <div className="section-body">
          {entries.length === 0 && (
            <div className="empty-state">
              <p>{t.noEntriesYet}</p>
            </div>
          )}
          {entries.map((entry) => {
            const media = entry.media || {};
            return (
              <div
                key={entry.id}
                className="library-row"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/media/${media.type}/${media.external_id}`)
                }
              >
                {media.cover_url ? (
                  <img
                    className="library-row-cover"
                    src={media.cover_url}
                    alt={media.title}
                  />
                ) : (
                  <div
                    className="library-row-cover"
                    style={{
                      background: "var(--bg-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: "var(--text-muted)",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    {media.title}
                  </div>
                )}
                <div className="library-row-info">
                  <div className="library-row-title">{media.title}</div>
                  <div className="library-row-meta">
                    <StatusBadge status={entry.status} />
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 10,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {media.type}
                    </span>
                  </div>
                </div>
                {entry.rating && (
                  <div
                    style={{
                      flexShrink: 0,
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    ★ {entry.rating}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
