import { useNavigate } from 'react-router-dom'
import { Search, CheckCircle, RotateCcw, PenLine } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAsync, simulateAsync } from '../hooks'
import PostCard from '../components/PostCard'

export default function ReviewPage() {
  const { review, dispatch, addToast } = useApp()
  const navigate = useNavigate()
  const { loading, run } = useAsync()

  const approve = async (post) => {
    await run(async () => {
      await simulateAsync(1500)
      dispatch({ type: 'UPDATE_POST', id: post.id, updates: { status: 'published', createdAt: 'Just now' } })
      addToast('🚀 Approved and published!', 'success')
    })
  }

  const reject = (post) => {
    dispatch({ type: 'UPDATE_POST', id: post.id, updates: { status: 'draft' } })
    addToast('Returned to drafts.', 'warning')
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
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => approve(post)}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner" /> Approving…</>
                    : <><CheckCircle size={12} /> Approve & Publish</>
                  }
                </button>
                <button className="btn btn-warning btn-sm" onClick={() => reject(post)}>
                  <RotateCcw size={12} /> Back to Draft
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
