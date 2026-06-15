import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Activity, CheckCircle2, FileText, LayoutDashboard, RefreshCw, Search, ShieldCheck, Trash2, Users, XCircle } from 'lucide-react'
import { adminApi } from '../api/admin'
import { postsApi } from '../api/posts'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'reviews', label: 'Reviews', icon: ShieldCheck },
  { id: 'audit', label: 'Audit', icon: Activity },
]

export default function AdminPage() {
  const { user, impersonateUser } = useAuth()
  const { dispatch, addToast } = useApp()
  const [users, setUsers] = useState([])
  const [adminPosts, setAdminPosts] = useState([])
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const loadAdminData = async () => {
    setLoading(true)
    try {
      const [userData, postData, statData, logData] = await Promise.all([
        adminApi.getUsers(), adminApi.getPosts(), adminApi.getStats(), adminApi.getLogs().catch(() => [])
      ])
      setUsers(Array.isArray(userData) ? userData : [])
      setAdminPosts(Array.isArray(postData) ? postData : [])
      setStats(statData || {})
      setLogs(Array.isArray(logData) ? logData : [])
    } catch (error) {
      console.error(error)
      addToast('Could not load admin data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') loadAdminData()
  }, [user?.role])

  const query = search.trim().toLowerCase()
  const filteredUsers = useMemo(() => users.filter(item => !query ||
    item.username?.toLowerCase().includes(query) || item.email?.toLowerCase().includes(query) || item.role?.toLowerCase().includes(query)
  ), [users, query])
  const filteredPosts = useMemo(() => adminPosts.filter(post => !query ||
    post.title?.toLowerCase().includes(query) || post.content?.toLowerCase().includes(query) || post.authorEmail?.toLowerCase().includes(query)
  ), [adminPosts, query])
  const reviewPosts = filteredPosts.filter(post => post.status === 'review')

  const removePost = async (post) => {
    setBusyId(`post-${post.id}`)
    try {
      await postsApi.deletePost(post.id)
      setAdminPosts(prev => prev.filter(item => item.id !== post.id))
      setUsers(prev => prev.map(item => ({ ...item, posts: (item.posts || []).filter(p => p.id !== post.id), postCount: item.email === post.authorEmail ? Math.max(0, (item.postCount || 1) - 1) : item.postCount })))
      dispatch({ type: 'DELETE_POST', id: post.id })
      addToast('Post deleted', 'success')
    } catch (error) {
      console.error(error)
      addToast('Could not delete post', 'error')
    } finally { setBusyId(null) }
  }

  const approvePost = async (post) => {
    setBusyId(`post-${post.id}`)
    try {
      const updated = await postsApi.updatePost(post.id, { title: post.title, content: post.content, category: post.category, status: 'published' })
      setAdminPosts(prev => prev.map(item => item.id === post.id ? { ...item, status: 'published' } : item))
      dispatch({ type: 'UPDATE_POST', id: post.id, updates: updated })
      addToast('Post approved and published', 'success')
    } catch (error) {
      console.error(error)
      addToast('Could not approve post', 'error')
    } finally { setBusyId(null) }
  }

  const deleteUser = async (target) => {
    if (target.email === user.email) return addToast('You cannot delete your own admin account', 'warning')
    setBusyId(`user-${target.id}`)
    try {
      await adminApi.deleteUser(target.id)
      setUsers(prev => prev.filter(item => item.id !== target.id))
      setAdminPosts(prev => prev.filter(post => post.authorEmail !== target.email))
      addToast('User and their content deleted', 'success')
    } catch (error) {
      console.error(error)
      addToast('Could not delete user', 'error')
    } finally { setBusyId(null) }
  }

  const changeRole = async (target) => {
    if (target.email === user.email) return addToast('You cannot change your own role', 'warning')
    const role = target.role === 'ADMIN' ? 'USER' : 'ADMIN'
    setBusyId(`user-${target.id}`)
    try {
      await adminApi.updateUserRole(target.id, role)
      setUsers(prev => prev.map(item => item.id === target.id ? { ...item, role } : item))
      addToast(`Role updated to ${role}`, 'success')
    } catch (error) {
      console.error(error)
      addToast('Could not update role', 'error')
    } finally { setBusyId(null) }
  }

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'threadforge-audit-log.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />

  const contentList = activeTab === 'reviews' ? reviewPosts : filteredPosts

  return <>
    <div className="topbar admin-topbar">
      <div className="topbar-title"><ShieldCheck size={18} /> Admin Portal <span className="admin-secure-pill">Secure</span></div>
      <div className="topbar-actions">
        <div className="search-wrap"><span className="search-icon"><Search size={14} /></span><input className="search-input" placeholder="Search the portal..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn btn-ghost" onClick={loadAdminData} disabled={loading}><RefreshCw size={14} /> Refresh</button>
      </div>
    </div>

    <div className="page-body admin-page">
      <div className="admin-hero">
        <div><span>Platform administration</span><h1>Control center</h1><p>Manage access, moderate publishing, and monitor platform activity.</p></div>
        <div className="admin-hero-status"><span className="status-dot" /> All systems operational</div>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}><Icon size={15} /> {tab.label}{tab.id === 'reviews' && reviewPosts.length > 0 && <b>{reviewPosts.length}</b>}</button> })}
      </div>

      {loading ? <div className="empty-state"><div className="spinner" /><div className="empty-title">Loading control center...</div></div> : <>
        {(activeTab === 'overview') && <>
          <div className="stats-grid admin-stat-grid">
            <div className="stat-card purple"><div className="stat-label">Registered users</div><div className="stat-value">{stats.totalUsers ?? users.length}</div></div>
            <div className="stat-card green"><div className="stat-label">Total content</div><div className="stat-value">{stats.totalPosts ?? adminPosts.length}</div></div>
            <div className="stat-card orange"><div className="stat-label">Drafts</div><div className="stat-value">{stats.totalDrafts ?? 0}</div></div>
            <div className="stat-card blue"><div className="stat-label">Pending review</div><div className="stat-value">{reviewPosts.length}</div></div>
          </div>
          <div className="admin-overview-grid">
            <div className="panel"><div className="panel-header">Moderation queue</div><div className="panel-body"><strong>{reviewPosts.length}</strong><p>submission{reviewPosts.length === 1 ? '' : 's'} waiting for a decision.</p><button className="btn btn-primary btn-sm" onClick={() => setActiveTab('reviews')}>Open review queue</button></div></div>
            <div className="panel"><div className="panel-header">Platform activity</div><div className="panel-body"><strong>{logs.length}</strong><p>audit events are currently available.</p><button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('audit')}>View audit trail</button></div></div>
          </div>
        </>}

        {activeTab === 'users' && <div className="admin-grid">{filteredUsers.map(item => <article className="admin-user-card" key={item.id}>
          <div className="admin-user-head"><div className="admin-avatar">{(item.username || item.email || 'U')[0].toUpperCase()}</div><div className="admin-user-meta"><div className="admin-user-name">{item.username || 'User'}</div><div className="admin-user-email">{item.email}</div></div><span className={`status-badge ${item.role === 'ADMIN' ? 'review' : 'published'}`}><span className="status-dot" />{item.role}</span></div>
          <div className="admin-user-details"><span>ID #{item.id}</span><span>{item.postCount || 0} posts</span></div>
          <div className="admin-card-actions"><button className="btn btn-surface btn-xs" onClick={() => changeRole(item)} disabled={busyId === `user-${item.id}`}>{item.role === 'ADMIN' ? 'Demote' : 'Promote'}</button><button className="btn btn-ghost btn-xs" onClick={() => impersonateUser(item)}>View as user</button><button className="btn btn-danger btn-xs" onClick={() => deleteUser(item)} disabled={busyId === `user-${item.id}`}><Trash2 size={12} /> Delete</button></div>
        </article>)}</div>}

        {(activeTab === 'content' || activeTab === 'reviews') && <div className="admin-content-list">
          {contentList.length === 0 ? <div className="empty-state"><div className="empty-title">{activeTab === 'reviews' ? 'Review queue is clear' : 'No content found'}</div></div> : contentList.map(post => <article className="admin-content-row" key={post.id}>
            <div className="admin-content-icon"><FileText size={17} /></div><div className="admin-content-copy"><div><h3>{post.title || 'Untitled post'}</h3><span className={`status-badge ${post.status || 'published'}`}><span className="status-dot" />{post.status || 'published'}</span></div><p>{post.content || 'No content preview available.'}</p><small>{post.authorEmail} · {post.category || 'Uncategorized'}</small></div>
            <div className="admin-content-actions">{post.status === 'review' && <button className="btn btn-success btn-sm" onClick={() => approvePost(post)} disabled={busyId === `post-${post.id}`}><CheckCircle2 size={13} /> Approve</button>}<button className="btn btn-danger btn-sm" onClick={() => removePost(post)} disabled={busyId === `post-${post.id}`}>{post.status === 'review' ? <><XCircle size={13} /> Reject</> : <><Trash2 size={13} /> Delete</>}</button></div>
          </article>)}
        </div>}

        {activeTab === 'audit' && <div className="panel"><div className="panel-header">Audit trail <button className="btn btn-ghost btn-xs" onClick={exportLogs} disabled={!logs.length}>Export JSON</button></div><div className="logs-list">{logs.length === 0 ? <div className="admin-empty">No audit activity available</div> : logs.map(log => <div className="log-row" key={log._id || `${log.entityId}-${log.timestamp}`}><div className="log-time">{new Date(log.timestamp).toLocaleString()}</div><div className="log-body"><strong>{log.user}</strong> {log.action} {log.entityType} #{log.entityId}</div></div>)}</div></div>}
      </>}
    </div>
  </>
}
