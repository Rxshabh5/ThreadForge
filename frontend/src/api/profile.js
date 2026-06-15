import axios from 'axios'

const API_BASE_URL = 'https://dummyjson.com'
const USERS_LIMIT = 30

const toNumericUserId = (userId) => {
  const n = Number(String(userId ?? '').replace(/\D/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 1
}

const mapDummyUser = (user) => {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.username || 'Unknown User'
  const website = user?.website || (user?.company?.name ? `https://${String(user.company.name).toLowerCase().replace(/\s+/g, '')}.com` : '')
  const location = [user?.address?.city, user?.address?.state, user?.address?.country].filter(Boolean).join(', ')

  return {
    id: user.id,
    name,
    handle: user?.username ? `@${String(user.username).toLowerCase()}` : '@user',
    email: user?.email || '',
    bio: user?.company?.title || user?.company?.department || 'Exploring ideas and sharing what I learn.',
    website,
    location,
    avatarIdx: user.id % 7,
    followers: 0,
    following: 0,
    joinedAt: 'March 2024',
    verified: Boolean(user?.role === 'admin' || user?.company?.department),
    coverIdx: user.id % 5,
    source: 'dummyjson',
  }
}

async function fetchUsers(limit = USERS_LIMIT) {
  const { data } = await axios.get(`${API_BASE_URL}/users`, {
    params: { limit, skip: 0 },
  })

  return Array.isArray(data.users) ? data.users : []
}

function buildSocialGraph(targetId, users) {
  const target = toNumericUserId(targetId)
  const mappedUsers = users.map(mapDummyUser)

  const followers = mappedUsers.filter((user) => user.id !== target && ((user.id * 3) + target) % 4 < 2)
  const following = mappedUsers.filter((user) => user.id !== target && ((target * 5) + user.id) % 5 < 2)

  return { followers, following }
}

export const profileApi = {
  getProfile: async (userId) => {
    const id = toNumericUserId(userId)

    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`)
      return mapDummyUser(response.data)
    } catch {
      return {
        id,
        name: `User ${id}`,
        handle: `@user${id}`,
        email: '',
        bio: 'Demo profile',
        website: '',
        location: '',
        avatarIdx: id % 7,
        followers: 0,
        following: 0,
        joinedAt: 'March 2024',
        verified: false,
        coverIdx: id % 5,
        source: 'fallback',
      }
    }
  },

  getConnections: async (userId) => {
    try {
      const users = await fetchUsers()
      const { followers, following } = buildSocialGraph(userId, users)
      return {
        followers,
        following,
        followersCount: followers.length,
        followingCount: following.length,
      }
    } catch {
      return {
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
      }
    }
  },

  getFollowersFollowing: async (userId) => {
    const { followersCount, followingCount } = await profileApi.getConnections(userId)
    return { followers: followersCount, following: followingCount }
  },
}

export default profileApi
