import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Clock, ArrowUpRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { versionsApi } from '../api/versions'

export default function VersionHistoryModal({ post, onClose, onRestore }) {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!post) return

    setLoading(true)
    versionsApi.getVersions(post.id)
      .then(data => {
        setVersions(data)
        setSelected(data[0] || null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [post])

  if (!post) return null

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
          <span className="modal-title">Version History</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body">
          <div className="panel" style={{ marginBottom: 16, padding: 0 }}>
            <div className="panel-header">Versions</div>
            <div className="panel-body" style={{ maxHeight: 260, overflowY: 'auto' }}>
              {loading
                ? <div className="empty-state" style={{ padding: 20 }}>Loading versions…</div>
                : versions.length === 0
                  ? <div className="empty-state" style={{ padding: 20 }}>No version history available</div>
                  : versions.map(version => (
                    <button
                      key={version._id}
                      className={`btn btn-ghost btn-xs ${selected?._id === version._id ? 'active' : ''}`}
                      style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}
                      onClick={() => setSelected(version)}
                    >
                      <span>{new Date(version.timestamp).toLocaleString()}</span>
                      <ArrowUpRight size={12} />
                    </button>
                  ))}
            </div>
          </div>
          {selected && (
            <div>
              <div className="preview-title">Preview</div>
              <div className="preview-meta" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={14} />
                <span>{new Date(selected.timestamp).toLocaleString()}</span>
                <span style={{ color: 'var(--text3)' }}>·</span>
                <span>{selected.title || 'Untitled version'}</span>
              </div>
              <div className="preview-body" style={{ maxHeight: 280, overflowY: 'auto' }}>
                <ReactMarkdown>{selected.content || 'No content'}</ReactMarkdown>
              </div>
              <div className="confirm-actions" style={{ marginTop: 18, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Clear</button>
                <button
                  className="btn btn-primary"
                  onClick={() => onRestore({ title: selected.title, content: selected.content, category: selected.category })}
                >
                  Restore version
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
