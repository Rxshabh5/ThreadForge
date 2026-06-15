import { Search, CheckCircle, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { postsApi } from '../api/posts'
import { useAsync, simulateAsync } from '../hooks'
import PostCard from '../components/PostCard'

export default function ReviewPage() {
  const { review, dispatch, addToast } = useApp()
  const { user } = useAuth()
  const { loading, run } = useAsync()

  const approve = async (post) => {
    await run(async () => {
      await simulateAsync(300)
      const updated = await postsApi.updatePost(post.id, {
        title: post.title, content: post.body, category: post.category, status: 'published'
      })
      dispatch({ type: 'UPDATE_POST', id: post.id, updates: updated })
      addToast('Approved and published', 'success')
    })
  }

  const reject = async (post) => {
    await postsApi.deletePost(post.id)
    dispatch({ type: 'DELETE_POST', id: post.id })
    addToast('Review submission rejected and removed', 'warning')
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <Search size={18} />
          In Review
          <span style={{ fontWeight: 400, fontSize: 14, color: 'var(--text3)' }}>({review.length})</span>
        </div>
      </div>

      <div className="page-body">
        {review.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Nothing in review</div>
            <div className="empty-sub">Submit a draft for review to see it here.</div>
          </div>
        ) : (
          review.map((post, i) => (
            <div key={post.id} style={{ animationDelay: `${i * 50}ms` }}>
              <PostCard post={post} />
              <div className="quick-actions">
                {user?.role === 'ADMIN' && <button
                  className="btn btn-success btn-sm"
                  onClick={() => approve(post)}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner" /> Approving…</>
                    : <><CheckCircle size={12} /> Approve & Publish</>
                  }
                </button>}
                {user?.role === 'ADMIN' && <button className="btn btn-danger btn-sm" onClick={() => reject(post)}>
                  <RotateCcw size={12} /> Reject & Delete
                </button>}
                {user?.role !== 'ADMIN' && <span className="review-pending-note">Awaiting administrator review</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
