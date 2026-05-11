// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { t } from '../lib/i18n'

export default function Register() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signUp(email, password, username)
    if (error) {
      setError(t.registerError)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">{t.registerTitle}</div>
      <div className="auth-body">
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t.usernameLabel}</label>
            <input className="form-input" type="text" required minLength={3}
              value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.emailLabel}</label>
            <input className="form-input" type="email" required
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.passwordLabel}</label>
            <input className="form-input" type="password" required minLength={6}
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
            type="submit" disabled={loading}>
            {loading ? t.loading : t.registerBtn}
          </button>
        </form>
        <p style={{ marginTop: 14, fontSize: 13, textAlign: 'center' }}>
          <Link to="/login">{t.alreadyHaveAccount}</Link>
        </p>
      </div>
    </div>
  )
}
