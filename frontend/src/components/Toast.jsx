import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const COLORS = {
  success: 'var(--green)',
  error:   'var(--red)',
  warning: 'var(--orange)',
  info:    'var(--accent)',
}

function Toast({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || Info

  return (
    <motion.div
      className={`toast ${toast.type}`}
      onClick={() => onRemove(toast.id)}
      role="alert"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.22 }}
    >
      <Icon size={15} style={{ color: COLORS[toast.type], flexShrink: 0 }} />
      <span className="toast-msg">{toast.message}</span>
      <X size={12} style={{ color: 'var(--text3)', flexShrink: 0, marginLeft: 4 }} />
    </motion.div>
  )
}

export default function ToastContainer() {
  const { toasts, removeToast } = useApp()

  return (
    <div className="toast-container">
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
