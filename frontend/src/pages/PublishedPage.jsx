import { useState } from 'react'
import { Globe, Search, LayoutList, LayoutGrid } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import { useDebounce } from '../hooks'

export default function PublishedPage() {
  const { published } = useApp()
  const [view,   setView]   = useState('list')
  const [search, setSearch] = useState('')
  const debSearch = useDebounce(search, 250)

  const filtered = published.filter(p =>
    !debSearch ||
    p.title.toLowerCase().includes(debSearch.toLowerCase()) ||
    p.tags.some(t => t.includes(debSearch.toLowerCase()))
  )

  const totalLikes    = published.reduce((a, p) => a + p.likes, 0)
  const totalComments = published.reduce((a, p) => a + p.comments, 0)
  const totalReposts  = published.reduce((a, p) => a + p.reposts, 0)

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <Globe size={18} />
          Published
          <span style={{ fontWeight: 400, fontSize: 14, color: 'var(--text3)' }}>({published.length})</span>
        </div>
        <div className="topbar-actions">
          <div className="search-wrap">
            <span className="search-icon"><Search size={14} /></span>
            <input
              className="search-input"
              placeholder="Search published…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="view-toggle">
            <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
              <LayoutList />
            </button>
            <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
              <LayoutGrid />
            </button>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Mini stats */}
        {published.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Live posts', value: published.length },
              { label: 'Total likes', value: totalLikes.toLocaleString() },
              { label: 'Comments', value: totalComments.toLocaleString() },
              { label: 'Reposts', value: totalReposts.toLocaleString() },
            ].map(s => (
              <div key={s.label} className="card" style={{ flex: 1, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌐</div>
            <div className="empty-title">{search ? 'No results' : 'Nothing published yet'}</div>
            <div className="empty-sub">
              {search ? `No published posts match "${search}"` : 'Publish your first post to see it here.'}
            </div>
          </div>
        ) : (
          <div className={view === 'grid' ? 'posts-grid' : ''}>
            {filtered.map((post, i) => (
              <div key={post.id} style={{ animationDelay: `${i * 40}ms` }}>
                <PostCard post={post} compact={view === 'grid'} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
