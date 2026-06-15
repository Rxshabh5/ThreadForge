import { useNavigate, useLocation } from 'react-router-dom'
import {
  Zap, PenLine, FileText, Search, Globe,
  BarChart2, ChevronRight, User, LogOut, ShieldCheck
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { AVATAR_GRADIENTS } from '../data/posts'

const NAV = [
  { path: '/',           icon: Zap,       label: 'Feed',       section: 'Studio' },
  { path: '/editor',     icon: PenLine,   label: 'New Post',   section: null },
  { path: '/drafts',     icon: FileText,  label: 'Drafts',     badge: 'drafts',    badgeColor: 'orange' },
  { path: '/review',     icon: Search,    label: 'In Review',  badge: 'review',    badgeColor: 'blue' },
  { path: '/published',  icon: Globe,     label: 'Published',  badge: 'published', badgeColor: 'green' },
  { path: '/analytics',  icon: BarChart2, label: 'Analytics',  section: 'Insights' },
  { path: '/profile',    icon: User,      label: 'Profile',    section: 'Account' },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { drafts, review, published } = useApp()
  const { user, logout } = useAuth()
  const navItems = user?.role === 'ADMIN'
    ? [
        ...NAV,
        { path: '/admin', icon: ShieldCheck, label: 'Admin', section: 'Manage' },
      ]
    : NAV

  const counts = { drafts: drafts.length, review: review.length, published: published.length }
  const [uc1, uc2] = AVATAR_GRADIENTS[user?.avatarIdx ?? 0]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark" onClick={() => navigate('/')}>
          <div className="logo-icon">🧵</div>
          <div>
            <div className="logo-text">ThreadForge</div>
            <div className="logo-tagline">Content Studio</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          const Icon     = item.icon
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
          const count    = item.badge ? counts[item.badge] : 0

          return (
            <div key={item.path}>
              {item.section && (
                <div className="nav-section-label" style={{ marginTop: i > 0 ? 12 : 0 }}>
                  {item.section}
                </div>
              )}
              <div
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(item.path)}
              >
                <span className="nav-icon"><Icon size={16} /></span>
                <span className="nav-label">{item.label}</span>
                {count > 0 && <span className={`nav-badge ${item.badgeColor}`}>{count}</span>}
                {isActive && <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.35 }} className="nav-label" />}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card" onClick={() => navigate('/profile')}>
          <div
            className="user-avatar"
            style={{ background: `linear-gradient(135deg,${uc1},${uc2})` }}
          >
            {user?.name?.[0] || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-handle">{user?.handle || '@user'}</div>
          </div>
          <button
            className="btn btn-icon-sm btn-ghost"
            title="Log out"
            style={{ marginLeft: 'auto', flexShrink: 0 }}
            onClick={e => { e.stopPropagation(); logout() }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
