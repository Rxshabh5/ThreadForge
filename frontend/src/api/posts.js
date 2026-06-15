import axios from "axios"
import { API_URL } from "./config"

function getAuthHeaders() {

  const token =
    localStorage.getItem("token")

  return {
    Authorization:
      `Bearer ${token}`
  }
}


function transformPost(post) {

  return {

    id: post.id,

    title: post.title,

    body: post.content,

    category: post.category,

    status: post.status || "published",

    tags: [],

    author:
      post.authorEmail || "You",

    authorEmail:
      post.authorEmail,

    authorRole:
      post.authorRole,

    authorHandle:
      `@${
        post.authorEmail
          ?.split("@")[0]
          || "you"
      }`,

    likes: 0,

    comments: 0,

    reposts: 0,

    bookmarks: 0,

    liked: false,

    bookmarked: false,

    reposted: false,

    createdAt: "now",

    readTime: 1,

    wordCount:
      post.content
        ? post.content.split(" ").length
        : 0,

    avatarIdx: 0,
  }
}


export const postsApi = {

  // GET POSTS
  getPosts: async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/posts`
        )

      return response.data.map(post => ({
        ...transformPost(post),
        likes: post.likes || 0,
        comments: post.comments || 0,
        reposts: post.reposts || 0,
        bookmarks: post.bookmarks || 0,
      }))

    } catch (error) {

      console.error(
        "Error fetching posts:",
        error
      )

      return []
    }
  },

  getMyPosts: async () => {
    const response = await axios.get(`${API_URL}/posts/mine`, { headers: getAuthHeaders() })
    return response.data.map(post => ({
      ...transformPost(post),
      likes: post.likes || 0,
      comments: post.comments || 0,
      reposts: post.reposts || 0,
      bookmarks: post.bookmarks || 0,
    }))
  },


  // CREATE POST
  createPost: async (
    postData
  ) => {

    try {

      const response =
        await axios.post(
          `${API_URL}/posts`,
          postData,
          {
            headers:
              getAuthHeaders()
          }
        )

      return transformPost(
        response.data
      )

    } catch (error) {

      console.error(
        "Error creating post:",
        error
      )

      throw error
    }
  },


  // UPDATE POST
  updatePost: async (
    id,
    postData
  ) => {

    try {

      const response =
        await axios.put(
          `${API_URL}/posts/${id}`,
          postData,
          {
            headers:
              getAuthHeaders()
          }
        )

      return transformPost(
        response.data
      )

    } catch (error) {

      console.error(
        "Error updating post:",
        error
      )

      throw error
    }
  },

  likePost: async (id, payload) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${id}/like`,
        payload,
        {
          headers: getAuthHeaders()
        }
      )
      return transformPost(response.data)
    } catch (error) {
      console.error('Error liking post:', error)
      throw error
    }
  },

  // DELETE POST
  deletePost: async (
    id
  ) => {

    try {

      await axios.delete(
        `${API_URL}/posts/${id}`,
        {
          headers:
            getAuthHeaders()
        }
      )

      return true

    } catch (error) {

      console.error(
        "Error deleting post:",
        error
      )

      throw error
    }
  }
}
