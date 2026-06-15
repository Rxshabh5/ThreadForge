import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../hooks'

export default function LoginPage({ from = '/', onSwitch }) {
  const { login, authError, setAuthError } = useAuth()
  const { loading, run } = useAsync()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setAuthError('Please fill in all fields.'); return }
    await run(async () => {
      const { ok } = await login(email, password)
      if (ok) navigate(from, { replace: true })
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🧵</div>
          <div>
            <div className="auth-logo-text">ThreadForge</div>
            <div className="auth-logo-sub">Content Studio</div>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your studio</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-input-icon" />
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setAuthError('') }}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="auth-label" style={{ margin: 0 }}>Password</label>
              <span className="auth-link" onClick={() => {}}>Forgot password?</span>
            </div>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                className="auth-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setAuthError('') }}
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="auth-error">
              <span>⚠️</span> {authError}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> Signing in…</>
              : <><span>Sign In</span> <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-social-row">
          {['Google', 'GitHub'].map(p => (
            <button
              key={p}
              className="auth-social-btn"
              onClick={() => setAuthError('Social login not implemented in demo.')}
            >
              {p === 'Google' ? '🌐' : '🐙'} {p}
            </button>
          ))}
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <span className="auth-link" onClick={onSwitch}>Create one free →</span>
        </div>
      </div>
    </div>
  )
}
