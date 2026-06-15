import { X, Clock, Hash, User } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { AVATAR_GRADIENTS } from '../data/posts'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function PreviewModal({ post, onClose }) {
  if (!post) return null

  const [c1, c2] = AVATAR_GRADIENTS[post.avatarIdx ?? 0]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.24 }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={post.status} />
            <span className="modal-title">Post Preview</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="modal-body">
          <div
            className="preview-cover"
            style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
          />

          <div className="preview-title">{post.title || 'Untitled'}</div>

          <div className="preview-meta">
            <User size={12} />
            <span>{post.author}</span>
            <span style={{ color: 'var(--text3)' }}>·</span>
            <Clock size={12} />
            <span>{post.readTime} min read</span>
            <span style={{ color: 'var(--text3)' }}>·</span>
            <span>{post.wordCount} words</span>
          </div>

          {post.tags?.length > 0 && (
            <div className="post-tags" style={{ padding: '0 0 14px 0' }}>
              {post.tags.map(t => (
                <span key={t} className="tag">
                  <Hash size={9} style={{ display: 'inline', marginRight: 1 }} />{t}
                </span>
              ))}
              {post.category && <span className="tag accent">{post.category}</span>}
            </div>
          )}

          <div className="preview-divider" />
          <div className="preview-body">
            <ReactMarkdown>{post.body || 'No content yet.'}</ReactMarkdown>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
