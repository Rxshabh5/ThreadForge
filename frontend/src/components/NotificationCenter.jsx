import { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function NotificationCenter() {
  const { notifications, removeNotification } = useApp()
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div style={{ position: 'absolute', right: 16, top: 56, width: 340, zIndex: 9999 }}>
      <div className="panel">
        <div className="panel-header">
          Notifications
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-xs" onClick={() => setOpen(false)}><X size={14} /></button>
          </div>
        </div>
        <div className="panel-body">
          {notifications.length === 0 ? (
            <div className="empty-state"><div className="empty-title">No notifications</div></div>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{n.body}</div>
                </div>
                <div>
                  <button className="btn btn-ghost btn-xs" onClick={() => removeNotification(n.id)}>Dismiss</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
