import { useNavigate } from 'react-router-dom'
import { FileText, Zap, Send, PenLine, Trash } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { draftsApi } from '../api/drafts'
import { useAsync, simulateAsync } from '../hooks'
import PostCard from '../components/PostCard'

export default function DraftsPage() {
  const { drafts, dispatch, addToast, setEditingPost, refreshDrafts } = useApp()
  const navigate = useNavigate()
  const { loading, run } = useAsync()

  const formatPost = (post, status) => ({
    ...post,
    body: post.content || '',
    status,
    tags: post.tags || [],
    author: post.authorEmail || 'You',
    authorHandle: `@${post.authorEmail?.split('@')[0] || 'you'}`,
    likes: post.likes || 0,
    comments: post.comments || 0,
    reposts: post.reposts || 0,
    bookmarks: post.bookmarks || 0,
    createdAt: 'Just now',
    readTime: 1,
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    avatarIdx: 0,
  })

  const quickPublish = async (post) => {
    await run(async () => {
      await simulateAsync(1000)

      try {
        const published = await draftsApi.publishDraft(post.id)

        dispatch({ type: 'ADD_POST', post: formatPost(published, 'published') })

        addToast(`"${post.title.substring(0, 30)}…" published! 🚀`, 'success')

        if (refreshDrafts) await refreshDrafts()

      } catch (e) {
        console.error(e)
        addToast('Failed to publish draft', 'error')
      }
    })
  }

  const deleteDraft = async (post) => {
    await run(async () => {
      try {
        await draftsApi.deleteDraft(post.id)
        addToast('Draft deleted', 'success')
        if (refreshDrafts) await refreshDrafts()
      } catch (e) {
        console.error(e)
        addToast('Failed to delete draft', 'error')
      }
    })
  }

  const submitReview = async (post) => {
    await run(async () => {
      try {
        const submitted = await draftsApi.submitForReview(post.id)
        dispatch({ type: 'ADD_POST', post: formatPost(submitted, 'review') })
        if (refreshDrafts) await refreshDrafts()
        addToast('Submitted for admin review', 'info')
      } catch (error) {
        console.error(error)
        addToast('Could not submit for review', 'error')
      }
    })
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <FileText size={18} />
          Drafts
          <span style={{ fontWeight: 400, fontSize: 14, color: 'var(--text3)' }}>({drafts.length})</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/editor')}>
            <PenLine size={13} /> New Post
          </button>
        </div>
      </div>

      <div className="page-body">
        {drafts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-title">No drafts</div>
            <div className="empty-sub">Your unpublished drafts will appear here. Start writing!</div>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/editor')}>
              <PenLine size={14} /> Create Draft
            </button>
          </div>
        ) : (
          drafts.map((post, i) => (
            <div key={post.id} style={{ animationDelay: `${i * 50}ms` }}>
              <div className="panel" style={{ padding: 12, marginBottom: 12 }}>
                <PostCard post={post} onDelete={deleteDraft} />
                <div className="quick-actions" style={{ padding: '10px 6px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => quickPublish(post)}
                    disabled={loading}
                  >
                    {loading ? <><span className="spinner" /> Publishing…</> : <><Zap size={12} /> Quick Publish</>}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => submitReview(post)}>
                    <Send size={12} /> Submit Review
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteDraft(post)}>
                    <Trash size={12} /> Delete
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setEditingPost(post); navigate('/editor') }}
                  >
                    <PenLine size={12} /> Continue Editing
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
