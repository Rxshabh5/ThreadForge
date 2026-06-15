import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PenLine, Search, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import { useDebounce } from '../hooks'

export default function FeedPage() {
  const { feedPosts = [], loadMorePosts, loadingMorePosts, hasMorePosts, postsError } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debSearch = useDebounce(search, 250)

  const filtered = feedPosts.filter((p) => {
    const q = debSearch.toLowerCase()
    return !q ||
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.category?.toLowerCase().includes(q)
  })

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <TrendingUp size={18} />
          Feed
        </div>
        <div className="topbar-actions">
          <div className="search-wrap">
            <span className="search-icon"><Search /></span>
            <input
              className="search-input"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/editor')}>
            <PenLine size={14} /> New Post
          </button>
        </div>
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <div className="empty-title">Nothing here yet</div>
            <div className="empty-sub">
              {search
                ? `No posts matching "${search}"`
                : 'Create your first post to get started!'}
            </div>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/editor')}>
                <PenLine size={14} /> Create Post
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="feed-grid">
              <AnimatePresence>
                {filtered.map((post, i) => (
                  <motion.div key={post.id} className="feed-item" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, delay: i * 0.02 }}>
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {!search && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <button
                  className="btn btn-ghost"
                  onClick={loadMorePosts}
                  disabled={loadingMorePosts || !hasMorePosts}
                >
                  {loadingMorePosts
                    ? 'Loading more posts...'
                    : hasMorePosts
                      ? 'Load More from DummyJSON'
                      : 'All posts loaded'}
                </button>
              </div>
            )}

            {postsError && (
              <div className="empty-sub" style={{ textAlign: 'center', marginTop: 12 }}>
                {postsError}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
