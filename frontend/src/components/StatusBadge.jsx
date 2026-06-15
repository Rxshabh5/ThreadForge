export default function StatusBadge({ status }) {
  const labels = { draft: 'Draft', review: 'In Review', published: 'Published' }
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot" />
      {labels[status] || status}
    </span>
  )
}
