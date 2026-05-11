// src/components/Navbar.jsx
// Top banner + navigation bar, inspired by MyAnimeList.

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { t } from '../lib/i18n'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const { theme, toggleTheme }     = useTheme()
  const navigate                   = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // First letter of username for avatar placeholder
  const initials = profile?.username?.[0]?.toUpperCase() || '?'

  return (
    <>
      {/* ── Banner ── */}
      <div className="app-banner">
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">
            Media<span>Vault</span>
          </div>
        </NavLink>
        <span className="banner-tagline">Your personal media library</span>
      </div>

      {/* ── Navigation bar ── */}
      <nav className="app-navbar">

        <NavLink to="/"        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          {t.home}
        </NavLink>
        <NavLink to="/search"  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t.search}
        </NavLink>

        {user && (
          <NavLink to="/library" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t.myLibrary}
          </NavLink>
        )}

        {user && profile && (
          <NavLink to={`/profile/${profile.username}`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t.profile}
          </NavLink>
        )}

        <div className="nav-spacer" />

        <div className="nav-right">
          {/* Theme toggle */}
          <button className="nav-btn" onClick={toggleTheme}>
            {theme === 'light' ? t.darkMode : t.lightMode}
          </button>

          {/* Auth */}
          {user ? (
            <>
              <div className="nav-user" onClick={() => profile && navigate(`/profile/${profile.username}`)}>
                <div className="nav-avatar">
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.username} />
                    : initials
                  }
                </div>
                <span className="nav-username">{profile?.username}</span>
              </div>
              <button className="nav-btn" onClick={handleSignOut}>{t.logout}</button>
            </>
          ) : (
            <NavLink to="/login" className="nav-btn" style={{ textDecoration: 'none' }}>
              {t.login}
            </NavLink>
          )}
        </div>

      </nav>
    </>
  )
}
