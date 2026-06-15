import { BarChart2, TrendingUp, Heart, MessageCircle, Repeat2, Bookmark, Clock, FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'

function BarChartRow({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="bar-item">
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="bar-val">{value.toLocaleString()}</span>
    </div>
  )
}

export default function AnalyticsPage() {
  const { posts, published, drafts, review, totalLikes, totalComments, totalReposts, totalBookmarks } = useApp()

  const totalEngagement = totalLikes + totalComments + totalReposts + totalBookmarks
  const avgWords   = posts.length ? Math.round(posts.reduce((a, p) => a + p.wordCount, 0) / posts.length) : 0
  const avgRead    = published.length ? Math.round(published.reduce((a, p) => a + p.readTime, 0) / published.length) : 0

  const maxEngagement = Math.max(totalLikes, totalComments, totalReposts, totalBookmarks, 1)
  const maxStatus     = Math.max(published.length, drafts.length, review.length, 1)

  const topPosts = [...posts]
    .sort((a, b) => (b.likes + b.comments + b.reposts) - (a.likes + a.comments + a.reposts))
    .slice(0, 5)

  const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <BarChart2 size={18} />
          Analytics
        </div>
      </div>

      <div className="page-body">
        <div className="stats-grid">
          {[
            { label: 'Total Engagement',  value: totalEngagement,        cls: 'purple', icon: <TrendingUp size={12}/> },
            { label: 'Total Likes',       value: totalLikes,             cls: 'green',  icon: <Heart size={12}/> },
            { label: 'Total Comments',    value: totalComments,          cls: 'blue',   icon: <MessageCircle size={12}/> },
            { label: 'Avg. Read Time',    value: `${avgRead}m`,          cls: 'orange', icon: <Clock size={12}/> },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {s.icon} {s.label}
              </div>
              <div className="stat-value">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
            </div>
          ))}
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-title">
              <Heart size={12} />
              Engagement Breakdown
            </div>
            <div className="bar-chart">
              <BarChartRow label="Likes"     value={totalLikes}     max={maxEngagement} color="var(--red)" />
              <BarChartRow label="Comments"  value={totalComments}  max={maxEngagement} color="var(--blue)" />
              <BarChartRow label="Reposts"   value={totalReposts}   max={maxEngagement} color="var(--green)" />
              <BarChartRow label="Bookmarks" value={totalBookmarks} max={maxEngagement} color="var(--yellow)" />
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-title">
              <FileText size={12} />
              Content Status
            </div>
            <div className="bar-chart">
              <BarChartRow label="Published" value={published.length} max={maxStatus} color="var(--green)" />
              <BarChartRow label="Drafts"    value={drafts.length}    max={maxStatus} color="var(--orange)" />
              <BarChartRow label="Review"    value={review.length}    max={maxStatus} color="var(--blue)" />
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { label: 'Avg. words',  value: avgWords.toLocaleString() },
                { label: 'Total posts', value: posts.length },
              ].map(s => (
                <div key={s.label} style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card full">
            <div className="analytics-title">
              <TrendingUp size={12} />
              Top Performing Posts
            </div>
            {topPosts.length === 0 ? (
              <p style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                No data yet. Start publishing!
              </p>
            ) : (
              topPosts.map((post, i) => {
                const score = post.likes + post.comments + post.reposts + post.bookmarks
                return (
                  <div key={post.id} className="top-post-item">
                    <div className="top-post-rank">{MEDALS[i]}</div>
                    <div className="top-post-info">
                      <div className="top-post-title">{post.title}</div>
                      <div className="top-post-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={10}/> {post.likes.toLocaleString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MessageCircle size={10}/> {post.comments.toLocaleString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Repeat2 size={10}/> {post.reposts.toLocaleString()}</span>
                        <span className={`status-badge ${post.status}`} style={{ fontSize: 9, padding: '1px 7px' }}>
                          <span className="status-dot" />{post.status}
                        </span>
                      </div>
                    </div>
                    <div className="top-post-engagement">
                      <div className="top-post-score">{score.toLocaleString()}</div>
                      <div className="top-post-score-label">total eng.</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
