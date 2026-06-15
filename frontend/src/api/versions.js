import axios from 'axios'
import { API_URL } from './config'

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
