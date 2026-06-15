import { useEffect, useMemo, useState } from 'react'
import {
  MapPin, Link2, Calendar, Edit2,
  Check, X, Heart, MessageCircle, Repeat2,
  Bookmark, Globe, FileText, Users, Award,
  TrendingUp
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useAsync, simulateAsync } from '../hooks'
import PostCard from '../components/PostCard'
import { AVATAR_GRADIENTS } from '../data/posts'
import { profileApi } from '../api/profile'

const COVERS = [
  'linear-gradient(135deg,#f4f1ec 0%,#e8e0d5 50%,#ddd1c7 100%)',
  'linear-gradient(135deg,#f9f6f0 0%,#f0ebe5 100%)',
  'linear-gradient(135deg,#e8e0d5 0%,#d4c5b9 100%)',
  'linear-gradient(135deg,#ddd1c7 0%,#c4b5a6 100%)',
  'linear-gradient(135deg,#b8a085 0%,#8b7355 100%)',
]

const ACHIEVEMENTS = [
  { icon: 'Launch', label: 'First Post', check: (postList) => postList.length >= 1 },
  { icon: 'Live', label: 'Published', check: (_, publishedPosts) => publishedPosts.length >= 1 },
  { icon: 'Like', label: '100 Likes', check: (_, __, totalLikes) => totalLikes >= 100 },
  { icon: 'Loop', label: 'Viral', check: (_, __, _likes, totalReposts) => totalReposts >= 10 },
  { icon: 'Star', label: '500 Likes', check: (_, __, totalLikes) => totalLikes >= 500 },
  { icon: 'Award', label: 'Power User', check: (postList, _, totalLikes) => postList.length >= 5 && totalLikes >= 200 },
]

function ConnectionList({ title, profiles, onOpenProfile }) {
  if (!profiles.length) {
    return (
      <div className="pf-widget" style={{ margin: '0 24px 18px' }}>
        <div className="pf-widget-title">{title}</div>
        <div className="empty-sub">No profiles to show yet.</div>
      </div>
    )
  }

  return (
    <div className="pf-widget" style={{ margin: '0 24px 18px' }}>
      <div className="pf-widget-title">{title}</div>
      <div style={{ display: 'grid', gap: 10 }}>
        {profiles.map((profile) => {
          const [c1, c2] = AVATAR_GRADIENTS[profile.avatarIdx ?? 0]
          return (
            <button
              key={profile.id}
              type="button"
              className="pf-stat-row"
              style={{ textAlign: 'left', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, cursor: 'pointer' }}
              onClick={() => onOpenProfile(profile.id)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${c1}, ${c2})`
                  }}
                >
                  {profile.name?.[0] || 'U'}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="pf-stat-label" style={{ color: 'var(--text)' }}>{profile.name}</span>
                  <span className="pf-follow-label" style={{ textTransform: 'none', letterSpacing: 0 }}>{profile.handle}</span>
                </span>
              </span>
              <span className="pf-follow-label" style={{ textTransform: 'none', letterSpacing: 0 }}>View profile</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateProfile, refreshSocialCounts } = useAuth()
  const { posts } = useApp()
  const navigate = useNavigate()
  const { profileId } = useParams()
  const { loading, run } = useAsync()

  const [activeTab, setActiveTab] = useState('posts')
  const [editing, setEditing] = useState(false)
  const [remoteProfile, setRemoteProfile] = useState(null)
  const [connections, setConnections] = useState({ followers: [], following: [], followersCount: 0, followingCount: 0 })
  const [connectionsView, setConnectionsView] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  })
  const currentUserId = user?.id

  const isOwnProfile = !profileId || String(profileId) === String(currentUserId)
  const viewedProfile = isOwnProfile ? user : remoteProfile

  useEffect(() => {
    if (isOwnProfile && user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      })
    }
  }, [isOwnProfile, user])

  useEffect(() => {
    setActiveTab('posts')
    setEditing(false)
    setConnectionsView('')
  }, [profileId, isOwnProfile])

  useEffect(() => {
    let active = true

    async function loadProfile() {
      if (!currentUserId) return

      setLoadingProfile(true)
      setProfileError('')

      try {
        const targetId = isOwnProfile ? currentUserId : profileId
        const socialPromise = profileApi.getConnections(targetId)
        const profilePromise = isOwnProfile ? Promise.resolve(null) : profileApi.getProfile(profileId)
        const [profile, social] = await Promise.all([profilePromise, socialPromise])

        if (!active) return

        if (!isOwnProfile) setRemoteProfile({ ...profile, followers: social.followersCount, following: social.followingCount })
        setConnections(social)

        if (isOwnProfile) {
          refreshSocialCounts(currentUserId)
        }
      } catch {
        if (active) setProfileError('We could not load this profile right now.')
      } finally {
        if (active) setLoadingProfile(false)
      }
    }

    loadProfile()
    return () => { active = false }
  }, [currentUserId, isOwnProfile, profileId, refreshSocialCounts])

  const profilePosts = useMemo(() => {
    if (!viewedProfile) return []
    if (isOwnProfile) return posts.filter((post) => post.canEdit !== false || post.authorHandle === user?.handle)
    return posts.filter((post) => String(post.authorId) === String(viewedProfile.id))
  }, [isOwnProfile, posts, user?.handle, viewedProfile])

  const publishedPosts = profilePosts.filter((post) => post.status === 'published')
  const bookmarked = isOwnProfile ? posts.filter((post) => post.bookmarked) : []
  const liked = isOwnProfile ? posts.filter((post) => post.liked) : []

  const currentPosts = activeTab === 'bookmarks' ? bookmarked : activeTab === 'liked' ? liked : profilePosts
  const totalLikes = profilePosts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = profilePosts.reduce((sum, post) => sum + post.comments, 0)
  const totalReposts = profilePosts.reduce((sum, post) => sum + post.reposts, 0)
  const totalBookmarks = profilePosts.reduce((sum, post) => sum + post.bookmarks, 0)

  const tabs = isOwnProfile
    ? [
        { key: 'posts', label: 'Posts', icon: FileText, count: profilePosts.length },
        { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark, count: bookmarked.length },
        { key: 'liked', label: 'Liked', icon: Heart, count: liked.length },
      ]
    : [
        { key: 'posts', label: 'Posts', icon: FileText, count: profilePosts.length },
      ]

  const stats = [
    { icon: FileText, label: 'Total Posts', value: profilePosts.length },
    { icon: Globe, label: 'Published', value: publishedPosts.length },
    { icon: Heart, label: 'Likes', value: totalLikes },
    { icon: MessageCircle, label: 'Comments', value: totalComments },
    { icon: Repeat2, label: 'Reposts', value: totalReposts },
    { icon: Bookmark, label: 'Bookmarks', value: totalBookmarks },
  ]

  if (!user) return null

  if (!viewedProfile && loadingProfile) {
    return <div className="page-body"><div className="empty-state"><div className="empty-title">Loading profile...</div></div></div>
  }

  if (!viewedProfile) {
    return <div className="page-body"><div className="empty-state"><div className="empty-title">Profile not available</div><div className="empty-sub">{profileError || 'Try again in a moment.'}</div></div></div>
  }

  const [uc1, uc2] = AVATAR_GRADIENTS[viewedProfile.avatarIdx ?? 0]
  const cover = COVERS[viewedProfile.coverIdx ?? 0]

  const handleSave = () => run(async () => {
    await simulateAsync(700)
    updateProfile(form)
    setEditing(false)
  })

  const handleCancel = () => {
    setForm({ name: user.name, bio: user.bio, location: user.location, website: user.website })
    setEditing(false)
  }

  const connectionProfiles = connectionsView === 'followers' ? connections.followers : connections.following

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <Users size={16} /> {isOwnProfile ? 'Profile' : 'Dummy Profile'}
        </div>
        <div className="topbar-actions">
          {!isOwnProfile && (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/profile')}>
              Back to My Profile
            </button>
          )}
          {isOwnProfile && editing ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                <X size={12} /> Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : <><Check size={12} /> Save</>}
              </button>
            </>
          ) : isOwnProfile ? (
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
              <Edit2 size={12} /> Edit Profile
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ padding: 0 }}>
        <div style={{ height: 140, background: cover, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(7,7,13,0.92) 100%)' }} />
        </div>

        <div className="pf-hero">
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div className="pf-avatar" style={{ background: `linear-gradient(135deg,${uc1},${uc2})` }}>
              {viewedProfile.name?.[0] || 'U'}
            </div>
            {viewedProfile.verified && <span className="pf-verified">OK</span>}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {isOwnProfile && editing ? (
              <div className="pf-edit-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="City, Country" value={form.location} onChange={e => setForm((p) => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" style={{ minHeight: 52 }} maxLength={160} value={form.bio} onChange={e => setForm((p) => ({ ...p, bio: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                  <label className="form-label">Website</label>
                  <input className="form-input" placeholder="https://yoursite.com" value={form.website} onChange={e => setForm((p) => ({ ...p, website: e.target.value }))} />
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <h1 className="pf-name">{viewedProfile.name}</h1>
                  {viewedProfile.verified && (
                    <span className="pf-verified-label"><Check size={9} /> Verified</span>
                  )}
                </div>
                <div className="pf-handle">{viewedProfile.handle}</div>
                {viewedProfile.bio && <p className="pf-bio">{viewedProfile.bio}</p>}
                <div className="pf-meta">
                  {viewedProfile.location && (
                    <span className="pf-meta-item"><MapPin size={11} /> {viewedProfile.location}</span>
                  )}
                  {viewedProfile.website && (
                    <a href={viewedProfile.website} className="pf-meta-item pf-meta-link" target="_blank" rel="noopener noreferrer">
                      <Link2 size={11} /> {viewedProfile.website.replace('https://', '')}
                    </a>
                  )}
                  <span className="pf-meta-item"><Calendar size={11} /> Joined {viewedProfile.joinedAt}</span>
                </div>
              </>
            )}
          </div>

          <div className="pf-follow-block">
            <button type="button" className="pf-follow-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setConnectionsView(connectionsView === 'followers' ? '' : 'followers')}>
              <span className="pf-follow-num">{(isOwnProfile ? user.followers : viewedProfile.followers)?.toLocaleString()}</span>
              <span className="pf-follow-label">Followers</span>
            </button>
            <div className="pf-follow-divider" />
            <button type="button" className="pf-follow-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setConnectionsView(connectionsView === 'following' ? '' : 'following')}>
              <span className="pf-follow-num">{(isOwnProfile ? user.following : viewedProfile.following)?.toLocaleString()}</span>
              <span className="pf-follow-label">Following</span>
            </button>
          </div>
        </div>

        {connectionsView && (
          <ConnectionList
            title={connectionsView === 'followers' ? 'Followers' : 'Following'}
            profiles={connectionProfiles}
            onOpenProfile={(id) => navigate(`/profile/${id}`)}
          />
        )}

        <div className="pf-body">
          <aside className="pf-sidebar">
            <div className="pf-widget">
              <div className="pf-widget-title"><TrendingUp size={12} /> Stats</div>
              {stats.map((s) => (
                <div key={s.label} className="pf-stat-row">
                  <span className="pf-stat-label">
                    <s.icon size={12} style={{ color: 'var(--accent)' }} /> {s.label}
                  </span>
                  <span className="pf-stat-val">{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pf-widget">
              <div className="pf-widget-title"><Award size={12} /> Achievements</div>
              <div className="pf-achievements-grid">
                {ACHIEVEMENTS.map((achievement) => {
                  const earned = achievement.check(profilePosts, publishedPosts, totalLikes, totalReposts)
                  return (
                    <div
                      key={achievement.label}
                      className={`pf-badge ${earned ? 'pf-badge-earned' : 'pf-badge-locked'}`}
                      title={earned ? achievement.label : `${achievement.label} (locked)`}
                    >
                      <span style={{ fontSize: 14 }}>{achievement.icon}</span>
                      <span className="pf-badge-label">{achievement.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          <div className="pf-content">
            <div className="pf-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`pf-tab ${activeTab === tab.key ? 'pf-tab-active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <tab.icon size={13} />
                  {tab.label}
                  <span className="pf-tab-count">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="pf-tab-body">
              {loadingProfile && <div className="empty-sub" style={{ marginBottom: 12 }}>{isOwnProfile ? 'Refreshing profile...' : 'Loading dummy profile...'}</div>}
              {profileError && <div className="empty-sub" style={{ marginBottom: 12 }}>{profileError}</div>}

              {currentPosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">Posts</div>
                  <div className="empty-title">Nothing here yet</div>
                  <div className="empty-sub">
                    {activeTab === 'bookmarks'
                      ? 'Bookmark posts to see them here.'
                      : activeTab === 'liked'
                        ? 'Posts you like will appear here.'
                        : isOwnProfile
                          ? 'Start creating content!'
                          : 'This dummy profile has no loaded posts yet. Use Load More on the feed to bring in more API posts.'}
                  </div>
                  {activeTab === 'posts' && isOwnProfile && (
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/editor')}>
                      Create your first post
                    </button>
                  )}
                </div>
              ) : (
                currentPosts.map((post, index) => (
                  <div key={post.id} style={{ animationDelay: `${index * 35}ms` }}>
                    <PostCard post={post} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
