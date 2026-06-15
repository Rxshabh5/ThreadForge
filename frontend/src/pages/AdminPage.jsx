import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, Users, FileText, Trash2, RefreshCw, Search } from 'lucide-react'
import { adminApi } from '../api/admin'
import { postsApi } from '../api/posts'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function AdminPage() {
  const { user, impersonateUser } = useAuth()
  const { posts, dispatch, addToast } = useApp()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [openIds, setOpenIds] = useState([])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getUsers()
      setUsers(Array.isArray(data) ? data : [])
      try {
        const s = await adminApi.getStats()
        setStats(s)
      } catch (e) {
        console.error('Could not load stats', e)
      }
      try {
        const l = await adminApi.getLogs()
        setLogs(Array.isArray(l) ? l : [])
      } catch (e) {
        console.error('Could not load logs', e)
      }
    } catch (error) {
      console.error(error)
      addToast('Could not load admin data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') loadUsers()
  }, [user?.role])

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(item =>
      !q ||
      item.username?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.role?.toLowerCase().includes(q)
    )
  }, [users, search])

  const totalPosts = users.reduce((sum, item) => sum + (item.postCount || 0), 0)
  const adminCount = users.filter(item => item.role === 'ADMIN').length

  const handleDeletePost = async (postId) => {
    setBusyId(`post-${postId}`)
    try {
      await postsApi.deletePost(postId)
      dispatch({ type: 'DELETE_POST', id: postId })
      setUsers(prev => prev.map(item => ({
        ...item,
        posts: (item.posts || []).filter(post => post.id !== postId),
        postCount: (item.posts || []).some(post => post.id === postId)
          ? Math.max(0, (item.postCount || 1) - 1)
          : item.postCount
      })))
      addToast('Post deleted', 'success')
    } catch (error) {
      console.error(error)
      addToast('Could not delete post', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.email === user.email) {
      addToast('You cannot delete your own admin account', 'warning')
      return
    }

    setBusyId(`user-${targetUser.id}`)
    try {
      await adminApi.deleteUser(targetUser.id)
      setUsers(prev => prev.filter(item => item.id !== targetUser.id))
      const targetPosts = targetUser.posts || []
      targetPosts.forEach(post => {
        dispatch({ type: 'DELETE_POST', id: post.id })
      })
      addToast('User deleted', 'success')
    } catch (error) {
      console.error(error)
      addToast('Could not delete user', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const togglePostsFor = (id) => {
    setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleChangeRole = async (targetUser, role) => {
    if (targetUser.id === user.id) {
      addToast('You cannot change your own role', 'warning')
      return
    }

    setBusyId(`user-${targetUser.id}`)
    try {
      await adminApi.updateUserRole(targetUser.id, role)
      setUsers(prev => prev.map(item => item.id === targetUser.id ? { ...item, role } : item))
      addToast(`Role updated to ${role}`, 'success')
    } catch (error) {
      console.error(error)
      addToast('Could not update role', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const exportAuditLogs = () => {
    if (!logs.length) {
      addToast('No logs available to export', 'warning')
      return
    }
    downloadJson(logs, 'audit-log.json')
    addToast('Audit log exported', 'success')
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <ShieldCheck size={18} />
          Admin
        </div>
        <div className="topbar-actions">
          <div className="search-wrap">
            <span className="search-icon"><Search size={14} /></span>
            <input
              className="search-input"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-warning" onClick={exportAuditLogs} disabled={!logs.length}>
            <FileText size={14} /> Export Audit
          </button>
          <button className="btn btn-ghost" onClick={loadUsers} disabled={loading}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-label">Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Posts</div>
            <div className="stat-value">{totalPosts || posts.length}</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">Admins</div>
            <div className="stat-value">{adminCount}</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-label">Visible</div>
            <div className="stat-value">{filteredUsers.length}</div>
          </div>
          <div className="stat-card gray">
            <div className="stat-label">Audit Logs</div>
            <div className="stat-value">{logs.length}</div>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-title">Loading admin panel...</div>
          </div>
        ) : (
          <>
          <div className="admin-grid">
            {filteredUsers.map(item => (
              <div className="admin-user-card" key={item.id}>
                <div className="admin-user-head">
                  <div className="admin-avatar">
                    {(item.username || item.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="admin-user-meta">
                    <div className="admin-user-name">{item.username || 'User'}</div>
                    <div className="admin-user-email">{item.email}</div>
                  </div>
                  <span className={`status-badge ${item.role === 'ADMIN' ? 'review' : 'published'}`}>
                    <span className="status-dot" /> {item.role}
                  </span>
                </div>

                <div className="admin-mini-row">
                  <span><Users size={13} /> ID {item.id}</span>
                  <span><FileText size={13} /> {item.postCount || 0} posts</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-success btn-xs"
                      onClick={() => handleChangeRole(item, item.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                      disabled={busyId === `user-${item.id}`}
                    >
                      {item.role === 'ADMIN' ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => { impersonateUser(item); addToast(`Now impersonating ${item.username || item.email}`, 'info') }}
                    >
                      Impersonate
                    </button>
                    <button
                      className="btn btn-surface btn-xs"
                      onClick={() => togglePostsFor(item.id)}
                    >
                      {openIds.includes(item.id) ? 'Hide posts' : `${item.postCount || 0} posts`}
                    </button>
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={() => handleDeleteUser(item)}
                      disabled={busyId === `user-${item.id}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {openIds.includes(item.id) && (
                  <div className="admin-post-list">
                    {(item.posts || []).length === 0 ? (
                      <div className="admin-empty">No posts yet</div>
                    ) : (
                      item.posts.map(post => (
                        <div className="admin-post-row" key={post.id}>
                          <div className="admin-post-copy">
                            <div className="admin-post-title">{post.title || 'Untitled post'}</div>
                            <div className="admin-post-body">{post.content || 'No content'}</div>
                          </div>
                          <button
                            className="btn btn-icon-sm btn-danger"
                            title="Delete post"
                            onClick={() => handleDeletePost(post.id)}
                            disabled={busyId === `post-${post.id}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="section-title">Activity Logs</div>
            {logs.length === 0 ? (
              <div className="empty-state"><div className="empty-title">No recent activity</div></div>
            ) : (
              <div className="logs-list">
                {logs.map(l => (
                  <div className="log-row" key={l._id}>
                    <div className="log-time">{new Date(l.timestamp).toLocaleString()}</div>
                    <div className="log-body">{l.user} {l.action} {l.entityType} {l.entityId}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          </>
        )}
      </div>
    </>
  )
}
