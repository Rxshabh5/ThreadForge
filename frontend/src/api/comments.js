import axios from 'axios'
import { getAuthHeaders } from './auth'

const API_URL = 'http://localhost:8000'

export const commentsApi = {
  getCommentsForPost: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/comments/post/${postId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  },

  createComment: async (comment) => {
    try {
      const response = await axios.post(`${API_URL}/comments`, comment, {
        headers: getAuthHeaders()
      })
      return response.data
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  likeComment: async (commentId) => {
    try {
      const response = await axios.post(`${API_URL}/comments/${commentId}/like`, {}, {
        headers: getAuthHeaders()
      })
      return response.data
    } catch (error) {
      console.error('Error liking comment:', error)
      throw error
    }
  }
}
