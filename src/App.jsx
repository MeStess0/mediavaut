// src/App.jsx
// Root component — sets up routing and global providers.

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import MediaDetail from './pages/MediaDetail'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

// ── Protected route: redirects to /login if not logged in ────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

// ── App routes ───────────────────────────────────────────────
function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"                       element={<Home />} />
          <Route path="/search"                 element={<Search />} />
          <Route path="/media/:type/:id"        element={<MediaDetail />} />
          <Route path="/profile/:username"      element={<Profile />} />
          <Route path="/login"                  element={<Login />} />
          <Route path="/register"               element={<Register />} />

          {/* Protected — requires login */}
          <Route path="/library" element={
            <ProtectedRoute><Library /></ProtectedRoute>
          } />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

// ── Root App with global providers ───────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
