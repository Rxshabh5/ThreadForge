import axios from 'axios'

const API_URL = 'http://localhost:8000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const versionsApi = {
  getVersions: async (postId) => {
    const response = await axios.get(`${API_URL}/versions`, {
      headers: getAuthHeaders(),
      params: { postId }
    })
    return response.data
  }
}
