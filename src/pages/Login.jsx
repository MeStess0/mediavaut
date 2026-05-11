// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { t } from '../lib/i18n'

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(t.loginError)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">{t.loginTitle}</div>
      <div className="auth-body">
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t.emailLabel}</label>
            <input className="form-input" type="email" required
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.passwordLabel}</label>
            <input className="form-input" type="password" required
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
            type="submit" disabled={loading}>
            {loading ? t.loading : t.loginBtn}
          </button>
        </form>
        <p style={{ marginTop: 14, fontSize: 13, textAlign: 'center' }}>
          <Link to="/register">{t.dontHaveAccount}</Link>
        </p>
      </div>
    </div>
  )
}
