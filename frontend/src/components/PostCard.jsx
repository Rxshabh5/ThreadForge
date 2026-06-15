import { useState } from 'react'
import { motion } from 'framer-motion'

import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Edit2,
  Trash2,
  Eye,
  Hash
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { useApp } from '../context/AppContext'

import { useAuth } from '../context/AuthContext'

import { postsApi } from '../api/posts'

import StatusBadge from './StatusBadge'
import ConfirmModal from './ConfirmModal'
import PreviewModal from './PreviewModal'
import CommentsModal from './CommentsModal'
import VersionHistoryModal from './VersionHistoryModal'

import {
  AVATAR_GRADIENTS
} from '../data/posts'


function ActionButton({
  icon: Icon,
  count,
  active,
  activeClass,
  onClick,
  title,
  filled
}) {

  return (

    <button
      className={`action-btn ${
        active ? activeClass : ''
      }`}
      onClick={e => {

        e.stopPropagation()

        onClick?.()
      }}
      title={title}
    >

      <Icon
        size={14}
        fill={
          filled && active
            ? 'currentColor'
            : 'none'
        }
      />

      {count > 0 && (
        <span>
          {count.toLocaleString()}
        </span>
      )}

    </button>
  )
}


export default function PostCard({
  post,
  compact = false,
  extraActions,
  onRestore,
  onDelete
}) {

  const {
    dispatch,
    addToast,
    setEditingPost,
    getCommentsForPost
  } = useApp()

  const { user } = useAuth()

  const navigate = useNavigate()

  const [confirming, setConfirming] =
    useState(false)

  const [showPreview, setShowPreview] =
    useState(false)

  const [showComments, setShowComments] =
    useState(false)

  const [showHistory, setShowHistory] =
    useState(false)

  const [restoring, setRestoring] =
    useState(false)

  const [c1, c2] =
    AVATAR_GRADIENTS[
      post.avatarIdx ?? 0
    ]

  const commentCount =
    getCommentsForPost(post.id).length

  const isAdmin =
    user?.role === 'ADMIN'

  const isOwner =
    Boolean(
      user?.email &&
      (
        post.authorEmail === user.email ||
        post.author === user.email
      )
    )

  const canManage =
    isAdmin || isOwner


  const handleOpenAuthor = (e) => {

    e.stopPropagation()

    if (post.authorId) {

      navigate(
        `/profile/${post.authorId}`
      )

    } else {

      navigate('/profile')
    }
  }


  const handleEdit = (e) => {

    e.stopPropagation()

    setEditingPost(post)

    navigate('/editor')
  }


  const handleDelete = async () => {
    try {
      if (typeof onDelete === 'function') {
        await onDelete(post)
      } else {
        await postsApi.deletePost(post.id)
        dispatch({
          type: 'DELETE_POST',
          id: post.id
        })
        addToast(
          'Post deleted.',
          'warning'
        )
      }
    } catch (error) {
      console.error(error)
      addToast(
        'Failed to delete post!',
        'error'
      )
    }
  }


  const handleRepost = () => {

    dispatch({
      type: 'TOGGLE_REPOST',
      id: post.id
    })

    if (!post.reposted) {

      addToast(
        'Reposted to your timeline!',
        'success'
      )

    } else {

      addToast(
        'Repost removed.',
        'info'
      )
    }
  }

  const handleRestore = async (versionData) => {
    try {
      setRestoring(true)

      const updatedPost = await postsApi.updatePost(post.id, {
        title: versionData.title || post.title,
        content: versionData.content || post.body,
        category: versionData.category || post.category
      })

      dispatch({
        type: 'UPDATE_POST',
        id: post.id,
        updates: updatedPost
      })

      addToast(
        'Version restored successfully.',
        'success'
      )

      setShowHistory(false)

      if (typeof onRestore === 'function') {
        onRestore(post.id, updatedPost)
      }
    } catch (error) {
      console.error(error)
      addToast('Could not restore version.', 'error')
    } finally {
      setRestoring(false)
    }
  }


  return (
    <>
      <motion.article
        className="post-card"
        onClick={() => setShowPreview(true)}
        role="article"
        aria-label={post.title}
        whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        transition={{ duration: 0.18 }}
      >

        {post.coverUrl && (
          <div className="post-cover" style={{ backgroundImage: `url(${post.coverUrl})` }} />
        )}

        <div
          style={{
            height: 3,
            background:
              `linear-gradient(
                90deg,
                ${c1},
                ${c2}
              )`,
            opacity:
              post.status === 'published'
                ? 1
                : 0.3,
          }}
        />

        <div className="post-header">

          <button
            type="button"
            className="post-avatar"
            style={{
              background:
                `linear-gradient(
                  135deg,
                  ${c1},
                  ${c2}
                )`,
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={handleOpenAuthor}
          >

            {post.author[0]}

          </button>

          <div className="post-meta">

            <div className="post-author">

              <button
                type="button"
                onClick={handleOpenAuthor}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >

                {post.author}

              </button>

              <span className="post-handle">
                {post.authorHandle}
              </span>

              <span className="post-dot">
                &middot;
              </span>

              <span
                style={{
                  fontSize: 12,
                  color: 'var(--text3)',
                  fontWeight: 400
                }}
              >
                {post.createdAt}
              </span>

            </div>

            <div className="post-time">

              <span className="meta-chip">
                Read {post.readTime}m
              </span>

              <span className="meta-chip">
                {post.wordCount.toLocaleString()}w
              </span>

              {post.category && (
                <span className="meta-chip">
                  {post.category}
                </span>
              )}

            </div>
          </div>

          <StatusBadge
            status={post.status}
          />

        </div>

        <div className="post-content">

          <div className="post-title">
            {post.title}
          </div>

          <div className="post-excerpt">
            {post.body.length > (compact ? 140 : 260)
              ? `${post.body.substring(0, compact ? 140 : 260)}…`
              : post.body}
          </div>
        </div>

        {post.tags.length > 0 && (

          <div className="post-tags">

            {post.tags.map(t => (

              <span
                key={t}
                className="tag"
              >

                <Hash
                  size={9}
                  style={{
                    display: 'inline',
                    marginRight: 2
                  }}
                />

                {t}

              </span>
            ))}
          </div>
        )}

        <div className="post-footer">

          <ActionButton
            icon={Heart}
            count={post.likes}
            active={post.liked}
            activeClass="active-like"
            filled
            onClick={async () => {
              dispatch({
                type: 'TOGGLE_LIKE',
                id: post.id
              })
              try {
                await postsApi.likePost(post.id, { liked: !post.liked })
              } catch (error) {
                console.error('Failed to persist like:', error)
              }
            }}
            title="Like"
          />

          <button
            className="action-btn"
            onClick={e => {

              e.stopPropagation()

              setShowComments(true)
            }}
            title="Comments"
          >

            <MessageCircle size={14} />

            {commentCount > 0 && (
              <span>{commentCount}</span>
            )}

          </button>

          <ActionButton
            icon={Repeat2}
            count={post.reposts}
            active={post.reposted}
            activeClass="active-repost"
            onClick={handleRepost}
            title="Repost"
          />

          <ActionButton
            icon={Bookmark}
            count={post.bookmarks}
            active={post.bookmarked}
            activeClass="active-bookmark"
            filled
            onClick={() => {

              dispatch({
                type: 'TOGGLE_BOOKMARK',
                id: post.id
              })

              if (!post.bookmarked) {

                addToast(
                  'Saved to bookmarks!',
                  'success'
                )
              }
            }}
            title="Bookmark"
          />

          <div className="action-btn-sep">

            <button
              className="btn btn-ghost btn-xs"
              onClick={e => {

                e.stopPropagation()

                setShowPreview(true)
              }}
            >

              <Eye size={11} />
              Read

            </button>

            {canManage && (
              <>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={handleEdit}
                >

                  <Edit2 size={11} />
                  Edit

                </button>

                <button
                  className="btn btn-surface btn-xs"
                  onClick={e => {

                    e.stopPropagation()

                    setShowHistory(true)
                  }}
                >

                  History

                </button>

                <button
                  className="btn btn-danger btn-xs"
                  onClick={e => {

                    e.stopPropagation()

                    setConfirming(true)
                  }}
                >

                  <Trash2 size={11} />

                </button>
              </>
            )}
          </div>
        </div>

        {extraActions}
      </motion.article>

      {confirming && (

        <ConfirmModal
          icon="Delete"
          title="Delete this post?"
          message={`"${
            post.title.substring(0, 50)
          }${
            post.title.length > 50
              ? '...'
              : ''
          }" will be permanently deleted.`}
          onConfirm={() => {

            handleDelete()

            setConfirming(false)
          }}
          onCancel={() =>
            setConfirming(false)
          }
        />
      )}

      {showPreview && (
        <PreviewModal
          post={post}
          onClose={() =>
            setShowPreview(false)
          }
        />
      )}

      {showComments && (
        <CommentsModal
          post={post}
          onClose={() =>
            setShowComments(false)
          }
        />
      )}

      {showHistory && (
        <VersionHistoryModal
          post={post}
          onClose={() => setShowHistory(false)}
          onRestore={handleRestore}
          restoring={restoring}
        />
      )}
    </>
  )
}
