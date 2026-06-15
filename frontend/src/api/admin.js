import axios from "axios"

const API_URL =
  "http://localhost:8000"


function getAuthHeaders() {

  const token =
    localStorage.getItem("token")

  return {
    Authorization:
      `Bearer ${token}`
  }
}


export const adminApi = {

  getUsers: async () => {

    const response =
      await axios.get(
        `${API_URL}/admin/users`,
        {
          headers:
            getAuthHeaders()
        }
      )

    return response.data
  },


  deleteUser: async (id) => {

    await axios.delete(
      `${API_URL}/admin/users/${id}`,
      {
        headers:
          getAuthHeaders()
      }
    )

    return true
  }

  ,

  updateUserRole: async (id, role) => {
    const response = await axios.put(
      `${API_URL}/admin/users/${id}/role`,
      { role },
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  getPosts: async () => {
    const response = await axios.get(`${API_URL}/admin/posts`, { headers: getAuthHeaders() })
    return response.data
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`, { headers: getAuthHeaders() })
    return response.data
  },

  getLogs: async () => {
    const response = await axios.get(`${API_URL}/admin/logs`, { headers: getAuthHeaders() })
    return response.data
  }
}
