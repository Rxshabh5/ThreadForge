import axios from 'axios'

const API_URL = 'http://localhost:8000'

export const searchApi = {
  search: async ({ q, category, tags, dateFrom, dateTo }) => {
    const params = {}
    if (q) params.q = q
    if (category) params.category = category
    if (tags) params.tags = Array.isArray(tags) ? tags.join(',') : tags
    if (dateFrom) params.dateFrom = dateFrom
    if (dateTo) params.dateTo = dateTo

    const response = await axios.get(`${API_URL}/search`, { params })
    return response.data
  }
}
