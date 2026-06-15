import { useState } from 'react'
import { Search, Bell, User, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import NotificationCenter from './NotificationCenter'

export default function Header() {
  const { user } = useAuth()
  const { notifications } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const { stopImpersonation, prevUser } = useAuth()

  const onSearch = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="topbar">
      <div className="topbar-title">ThreadForge</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <form onSubmit={onSearch} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="search-wrap">
            <span className="search-icon"><Search size={14} /></span>
            <input className="search-input" placeholder="Search posts, users..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </form>

        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-icon" title="Notifications" onClick={() => setShowNotifications(s => !s)}>
            <Bell size={16} />
            {notifications.length > 0 && <span className="nav-badge purple" style={{ position: 'absolute', top: -6, right: -6 }}>{notifications.length}</span>}
          </button>
          {showNotifications && <NotificationCenter />}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {prevUser && (
            <button className="btn btn-warning btn-sm" onClick={() => stopImpersonation()}>Stop impersonation</button>
          )}
          <button className="btn btn-ghost" onClick={() => navigate('/profile')}>{user?.name || 'Me'} <span style={{ marginLeft: 8 }}><User size={14} /></span></button>
        </div>
      </div>
    </div>
  )
}
