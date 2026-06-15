import { useState, useRef, useEffect } from 'react'
import { X, Heart, Reply, Trash2, Send, CornerDownRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { AVATAR_GRADIENTS } from '../data/posts'
import { commentsApi } from '../api/comments'

// ─── Single Reply ────────────────────────────────────────────────────────────
function ReplyItem({ reply, onLike, onDelete, currentUserId }) {
  const [c1, c2] = AVATAR_GRADIENTS[reply.avatarIdx ?? 0]
  const isOwn = reply.handle === '@you' || reply.author === 'You'

  return (
    <div className="reply-item">
      <CornerDownRight size={12} className="reply-arrow" />
      <div className="comment-avatar comment-avatar-sm" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
        {reply.author[0]}
      </div>
      <div className="comment-body-wrap">
        <div className="comment-header">
          <span className="comment-author">{reply.author}</span>
          <span className="comment-handle">{reply.handle}</span>
          <span className="comment-dot">·</span>
          <span className="comment-time">{reply.createdAt}</span>
        </div>
        <div className="comment-text">{reply.body}</div>
        <div className="comment-actions">
          <button
            className={`comment-action-btn ${reply.liked ? 'liked' : ''}`}
            onClick={() => onLike(reply.id)}
          >
            <Heart size={12} fill={reply.liked ? 'currentColor' : 'none'} />
            {reply.likes > 0 && <span>{reply.likes}</span>}
          </button>
          {isOwn && (
            <button className="comment-action-btn danger" onClick={() => onDelete(reply.id)}>
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Single Comment ──────────────────────────────────────────────────────────
function CommentItem({ comment, postId }) {
  const { commentsDispatch, dispatch: postsDispatch } = useApp()
  const { user } = useAuth()
  const [replying,  setReplying]  = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showReplies, setShowReplies] = useState(true)
  const replyRef = useRef(null)

  const [c1, c2] = AVATAR_GRADIENTS[comment.avatarIdx ?? 0]
  const [uc1, uc2] = AVATAR_GRADIENTS[user?.avatarIdx ?? 0]
  const isOwn = comment.handle === '@you' || comment.handle === ('@' + user?.handle?.replace('@', ''))

  const handleLike = async () => {
    try {
      await commentsApi.likeComment(comment.id)
      commentsDispatch({ type: 'TOGGLE_COMMENT_LIKE', id: comment.id })
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }

  const handleReplyLike = (id) => commentsDispatch({ type: 'TOGGLE_REPLY_LIKE', id })

  const handleDeleteComment = () => {
    commentsDispatch({ type: 'DELETE_COMMENT', id: comment.id })
    postsDispatch({ type: 'DECREMENT_COMMENTS', id: postId })
  }

  const handleDeleteReply = (replyId) => {
    commentsDispatch({ type: 'DELETE_REPLY', commentId: comment.id, replyId })
  }

  const handleSubmitReply = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    const reply = {
      id: `r_${Date.now()}`,
      parentId: comment.id,
      author: user?.name || 'You',
      handle: user?.handle || '@you',
      avatarIdx: user?.avatarIdx ?? 0,
      body: replyText.trim(),
      likes: 0, liked: false,
      createdAt: 'Just now',
    }
    commentsDispatch({ type: 'ADD_REPLY', parentId: comment.id, reply })
    setReplyText('')
    setReplying(false)
    setShowReplies(true)
  }

  const replies = comment.replies || []

  return (
    <div className="comment-item">
      <div className="comment-main">
        <div className="comment-avatar" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
          {comment.author[0]}
        </div>
        <div className="comment-body-wrap" style={{ flex: 1 }}>
          <div className="comment-header">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-handle">{comment.handle}</span>
            <span className="comment-dot">·</span>
            <span className="comment-time">{comment.createdAt}</span>
          </div>
          <div className="comment-text">{comment.body}</div>
          <div className="comment-actions">
            <button className={`comment-action-btn ${comment.liked ? 'liked' : ''}`} onClick={handleLike}>
              <Heart size={12} fill={comment.liked ? 'currentColor' : 'none'} />
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
            <button className="comment-action-btn" onClick={() => { setReplying(!replying); setTimeout(() => replyRef.current?.focus(), 50) }}>
              <Reply size={12} /> Reply
            </button>
            {replies.length > 0 && (
              <button className="comment-action-btn" onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? '▾' : '▸'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
            {isOwn && (
              <button className="comment-action-btn danger" onClick={handleDeleteComment}>
                <Trash2 size={11} />
              </button>
            )}
          </div>

          {/* Reply input */}
          {replying && (
            <form onSubmit={handleSubmitReply} className="reply-form">
              <div
                className="comment-avatar comment-avatar-sm"
                style={{ background: `linear-gradient(135deg,${uc1},${uc2})`, flexShrink: 0 }}
              >
                {(user?.name || 'Y')[0]}
              </div>
              <div className="reply-input-wrap">
                <input
                  ref={replyRef}
                  className="comment-input"
                  placeholder={`Reply to ${comment.author}…`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') setReplying(false) }}
                />
                <button type="submit" className="comment-send-btn" disabled={!replyText.trim()}>
                  <Send size={13} />
                </button>
                <button type="button" className="comment-cancel-btn" onClick={() => setReplying(false)}>
                  <X size={13} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="replies-list">
          {replies.map(reply => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onLike={handleReplyLike}
              onDelete={handleDeleteReply}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Comments Modal ──────────────────────────────────────────────────────────
export default function CommentsModal({ post, onClose }) {
  const { getCommentsForPost, commentsDispatch, dispatch: postsDispatch } = useApp()
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const postComments = getCommentsForPost(post.id)
  const [uc1, uc2] = AVATAR_GRADIENTS[user?.avatarIdx ?? 0]
  const [pc1, pc2] = AVATAR_GRADIENTS[post.avatarIdx ?? 0]

  useEffect(() => {
    let mounted = true
    const loadComments = async () => {
      setLoading(true)
      try {
        const comments = await commentsApi.getCommentsForPost(post.id)
        if (!mounted) return
        commentsDispatch({ type: 'SET_COMMENTS', comments })
      } catch (error) {
        console.error('Failed to load comments:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadComments()
    return () => {
      mounted = false
    }
  }, [post.id, commentsDispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || posting) return
    setPosting(true)

    try {
      const commentPayload = {
        postId: post.id,
        body: text.trim(),
        createdAt: 'Just now'
      }

      const savedComment = await commentsApi.createComment(commentPayload)

      const comment = {
        id: savedComment.id,
        postId: savedComment.postId,
        author: savedComment.authorName || user?.name || 'You',
        handle: savedComment.authorHandle || user?.handle || '@you',
        avatarIdx: user?.avatarIdx ?? 0,
        body: savedComment.body,
        likes: savedComment.likes || 0,
        liked: false,
        createdAt: savedComment.createdAt || 'Just now',
        replies: [],
      }

      commentsDispatch({ type: 'ADD_COMMENT', comment })
      postsDispatch({ type: 'INCREMENT_COMMENTS', id: post.id })
      setText('')
    } catch (error) {
      console.error('Failed to save comment:', error)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal comments-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="comment-avatar comment-avatar-sm"
              style={{ background: `linear-gradient(135deg,${pc1},${pc2})` }}
            >
              {post.author[0]}
            </div>
            <div>
              <div className="modal-title" style={{ fontSize: 15, marginBottom: 1 }}>{post.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{postComments.length} comment{postComments.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        {/* New comment input */}
        <div className="comments-input-area">
          <div
            className="comment-avatar"
            style={{ background: `linear-gradient(135deg,${uc1},${uc2})`, flexShrink: 0 }}
          >
            {(user?.name || 'Y')[0]}
          </div>
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              className="comment-textarea"
              placeholder="Write a comment…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e) }}
              rows={text.split('\n').length > 1 ? Math.min(text.split('\n').length + 1, 5) : 1}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!text.trim() || posting}
              style={{ flexShrink: 0 }}
            >
              {posting ? <span className="spinner" /> : <Send size={13} />}
              {posting ? '' : 'Post'}
            </button>
          </form>
        </div>

        <div style={{ fontSize: 10, color: 'var(--text3)', padding: '0 20px 4px', textAlign: 'right' }}>
          Ctrl+Enter to post
        </div>

        {/* Comments list */}
        <div className="comments-list">
          {loading ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-title">Loading comments…</div>
            </div>
          ) : postComments.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-icon" style={{ fontSize: 36 }}>💬</div>
              <div className="empty-title">No comments yet</div>
              <div className="empty-sub">Be the first to share your thoughts!</div>
            </div>
          ) : (
            postComments.map(comment => (
              <CommentItem key={comment.id} comment={comment} postId={post.id} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
