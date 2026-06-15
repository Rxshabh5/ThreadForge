import axios from 'axios'
import { getAuthHeaders, getEmailFromToken } from './auth'
import { API_URL } from './config'

export const draftsApi = {

  saveDraft: async (draft) => {
    const authorEmail = draft.authorEmail || getEmailFromToken()
    const payload = {
      // include id when updating existing draft
      ...(draft.id ? { id: draft.id } : {}),
      title: draft.title,
      content: draft.content,
      category: draft.category,
      authorEmail
    }

    const response = await axios.post(
      `${API_URL}/drafts`,
      payload,
      { headers: getAuthHeaders() }
    )

    return response.data
  },

  getDrafts: async (email) => {
    const e = email || getEmailFromToken()
    if (!e) return []
    const response = await axios.get(`${API_URL}/drafts/${encodeURIComponent(e)}`)
    return response.data
  },

  publishDraft: async (id) => {
    const response = await axios.post(`${API_URL}/drafts/publish/${id}`, null, { headers: getAuthHeaders() })
    return response.data
  },

  submitForReview: async (id) => {
    const response = await axios.post(`${API_URL}/drafts/review/${id}`, null, { headers: getAuthHeaders() })
    return response.data
  },

  deleteDraft: async (id) => {
    const response = await axios.delete(`${API_URL}/drafts/${id}`, { headers: getAuthHeaders() })
    return response.data
  }
}
