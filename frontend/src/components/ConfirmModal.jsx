import { X } from 'lucide-react'

export default function ConfirmModal({ icon, title, message, onConfirm, onCancel, confirmLabel = 'Delete', confirmClass = 'btn-danger' }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Confirm Action</span>
          <button className="modal-close" onClick={onCancel}><X size={14} /></button>
        </div>
        <div className="modal-body confirm-dialog">
          <div className="confirm-icon">{icon || '🗑️'}</div>
          <div className="confirm-title">{title}</div>
          <div className="confirm-sub">{message}</div>
          <div className="confirm-actions">
            <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button className={`btn ${confirmClass}`} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
