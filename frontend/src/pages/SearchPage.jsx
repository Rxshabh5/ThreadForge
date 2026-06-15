import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import PostCard from '../components/PostCard'
import { searchApi } from '../api/search'
import { useAsync } from '../hooks'

export default function SearchPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialQuery = params.get('q') || ''

  const [q, setQ] = useState(initialQuery)
  const [results, setResults] = useState([])
  const { loading, run } = useAsync()

  const doSearch = async (query = q) => {
    const term = query.trim()
    if (!term) {
      setResults([])
      return
    }

    await run(async () => {
      const res = await searchApi.search({ q: term })
      setResults(res.map(r => ({ id: r.id, title: r.title, body: r.content, category: r.category })))
    })
  }

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery)
    }
  }, [initialQuery])

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Search</div>
        <div className="topbar-actions">
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="form-input" placeholder="Search titles, content, categories..." value={q} onChange={e => setQ(e.target.value)} />
            <button className="btn btn-primary" onClick={doSearch} disabled={loading}><Search size={14} /> Search</button>
          </div>
        </div>
      </div>

      <div className="page-body">
        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <div className="empty-title">No results</div>
            <div className="empty-sub">Search for posts by title, content, or category.</div>
          </div>
        ) : (
          results.map((post, i) => (
            <div key={post.id} style={{ animationDelay: `${i * 40}ms` }}>
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>
    </>
  )
}
