import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../hooks'

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['var(--red)', 'var(--orange)', 'var(--yellow)', 'var(--green)']
  const labels = ['', 'Weak', 'Fair', 'Strong']

  if (!password) return null

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="strength-bar"
            style={{ background: i < score ? colors[score] : 'var(--surface3)' }}
          />
        ))}
        <span style={{ fontSize: 11, color: colors[score], marginLeft: 6 }}>{labels[score]}</span>
      </div>
      <div className="strength-checks">
        {checks.map(c => (
          <div key={c.label} className={`strength-check ${c.pass ? 'pass' : ''}`}>
            <Check size={10} /> {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage({ from = '/', onSwitch }) {
  const { register, authError, setAuthError } = useAuth()
  const { loading, run } = useAsync()
  const navigate = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [agreed,   setAgreed]   = useState(false)
  const [role,     setRole]     = useState('USER')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) { setAuthError('Please fill in all fields.'); return }
    if (password !== confirm) { setAuthError('Passwords do not match.'); return }
    if (password.length < 6) { setAuthError('Password must be at least 6 characters.'); return }
    if (!agreed) { setAuthError('Please agree to the terms to continue.'); return }
    await run(async () => {
      const { ok } = await register(name, email, password, role)
      if (ok) navigate(from, { replace: true })
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" style={{ background: 'rgba(34,197,94,0.18)' }} />
        <div className="auth-orb auth-orb-2" style={{ background: 'rgba(124,111,247,0.14)' }} />
        <div className="auth-orb auth-orb-3" style={{ background: 'rgba(249,115,22,0.1)' }} />
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
          <h1>Create your account</h1>
          <p>Start publishing great content today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Display name</label>
            <div className="auth-input-wrap">
              <User size={15} className="auth-input-icon" />
              <input
                className="auth-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => { setName(e.target.value); setAuthError('') }}
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                className="auth-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={e => { setPassword(e.target.value); setAuthError('') }}
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm password</label>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                className="auth-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setAuthError('') }}
                style={{ borderColor: confirm && password !== confirm ? 'var(--red)' : undefined }}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Register as</label>
            <div className="auth-role-toggle">
              <button
                type="button"
                className={`auth-role-btn ${role === 'USER' ? 'active' : ''}`}
                onClick={() => setRole('USER')}
              >
                <User size={14} /> User
              </button>
              <button
                type="button"
                className={`auth-role-btn ${role === 'ADMIN' ? 'active' : ''}`}
                onClick={() => setRole('ADMIN')}
              >
                <ShieldCheck size={14} /> Admin
              </button>
            </div>
          </div>

          <label className="auth-checkbox">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>I agree to the <span className="auth-link">Terms of Service</span> and <span className="auth-link">Privacy Policy</span></span>
          </label>

          {authError && (
            <div className="auth-error">
              <span>⚠️</span> {authError}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> Creating account…</>
              : <><span>Create Account</span> <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <span className="auth-link" onClick={onSwitch}>Sign in →</span>
        </div>
      </div>
    </div>
  )
}
