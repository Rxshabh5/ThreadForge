import axios from 'axios'
import { API_URL } from './config'
import { getAuthHeaders } from './auth'

export const versionsApi = {
  getVersions: async (postId) => {
    const response = await axios.get(`${API_URL}/versions`, {
      headers: getAuthHeaders(),
      params: { postId }
    })
    return response.data
  }
}
