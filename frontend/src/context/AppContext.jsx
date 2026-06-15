import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect
} from "react"

import { postsApi } from "../api/posts"
import { draftsApi } from "../api/drafts"
import { getEmailFromToken } from "../api/auth"
import { useAuth } from "./AuthContext"

export const AppContext = createContext(null)

export const useApp = () => useContext(AppContext)


// POSTS REDUCER
function postsReducer(state, action) {

  switch (action.type) {

    case "SET_POSTS":
      return action.posts

    case "ADD_POST":
      return [action.post, ...state]

    case "UPDATE_POST":
      return state.map(post =>
        post.id === action.id
          ? { ...post, ...action.updates }
          : post
      )

    case "DELETE_POST":
      return state.filter(
        post => post.id !== action.id
      )

    case "TOGGLE_LIKE":
      return state.map(post =>
        post.id === action.id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked
                ? post.likes - 1
                : post.likes + 1
            }
          : post
      )

    case "TOGGLE_BOOKMARK":
      return state.map(post =>
        post.id === action.id
          ? {
              ...post,
              bookmarked: !post.bookmarked,
              bookmarks: post.bookmarked
                ? post.bookmarks - 1
                : post.bookmarks + 1
            }
          : post
      )

    case "TOGGLE_REPOST":
      return state.map(post =>
        post.id === action.id
          ? {
              ...post,
              reposted: !post.reposted,
              reposts: post.reposted
                ? post.reposts - 1
                : post.reposts + 1
            }
          : post
      )

    case "INCREMENT_COMMENTS":
      return state.map(post =>
        post.id === action.id
          ? {
              ...post,
              comments: post.comments + 1
            }
          : post
      )

    case "DECREMENT_COMMENTS":
      return state.map(post =>
        post.id === action.id
          ? {
              ...post,
              comments: Math.max(
                0,
                post.comments - 1
              )
            }
          : post
      )

    default:
      return state
  }
}


// COMMENTS REDUCER
function commentsReducer(state, action) {

  switch (action.type) {

    case "SET_COMMENTS":
      return action.comments

    case "ADD_COMMENT":
      return [action.comment, ...state]

    case "DELETE_COMMENT":
      return state.filter(
        comment => comment.id !== action.id
      )

    case "TOGGLE_COMMENT_LIKE":
      return state.map(comment =>
        comment.id === action.id
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked
                ? comment.likes - 1
                : comment.likes + 1
            }
          : comment
      )

    case "ADD_REPLY":
      return state.map(comment =>
        comment.id === action.parentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                action.reply
              ]
            }
          : comment
      )

    case "TOGGLE_REPLY_LIKE":
      return state.map(comment => ({
        ...comment,
        replies: (comment.replies || []).map(reply =>
          reply.id === action.id
            ? {
                ...reply,
                liked: !reply.liked,
                likes: reply.liked
                  ? reply.likes - 1
                  : reply.likes + 1
              }
            : reply
        )
      }))

    case "DELETE_REPLY":
      return state.map(comment =>
        comment.id === action.commentId
          ? {
              ...comment,
              replies: (comment.replies || []).filter(
                reply => reply.id !== action.replyId
              )
            }
          : comment
      )

    default:
      return state
  }
}


export function AppProvider({ children }) {

  const { user } = useAuth()

  const [posts, dispatch] = useReducer(
    postsReducer,
    []
  )

  const [comments, commentsDispatch] = useReducer(
    commentsReducer,
    []
  )

  const [toasts, setToasts] = useState([])

  const [notifications, setNotifications] = useState([])

  const [editingPost, setEditingPost] = useState(null)

  const [activePostId, setActivePostId] = useState(null)

  const [userDrafts, setUserDrafts] = useState([])


  // FETCH POSTS FROM BACKEND
 const fetchPosts = async () => {

  try {

    const [publicPosts, myPosts] = await Promise.all([
      postsApi.getPosts(),
      getEmailFromToken() ? postsApi.getMyPosts() : Promise.resolve([])
    ])

    const byId = new Map(publicPosts.map(post => [post.id, post]))
    myPosts.forEach(post => byId.set(post.id, post))
    const posts = Array.from(byId.values())

    const formattedPosts = posts.map(post => ({

      ...post,

      status: post.status || "published",

      tags: post.tags || [],

      author: post.author || "You",

      authorHandle: post.authorHandle || "@you",

      liked: false,

      bookmarked: false,

      reposted: false,

      avatarIdx: 0,

      createdAt: "now",

      readTime: 1,

      wordCount:
        post.body
          ? post.body.split(" ").length
          : 0
    }))

    dispatch({
      type: "SET_POSTS",
      posts: formattedPosts
    })

  } catch (error) {

    console.error(error)
  }
}


  // LOAD POSTS ON START
  useEffect(() => {

    fetchPosts()

    // fetch user drafts if authenticated
    const email = getEmailFromToken()
    if (email) {
      (async () => {
        try {
          const drafts = await draftsApi.getDrafts(email)
          setUserDrafts(drafts)
        } catch (e) {
          console.error('Failed to fetch drafts', e)
        }
      })()
    }

  }, [])

  const refreshDrafts = async () => {
    try {
      const email = getEmailFromToken()
      if (!email) return
      const drafts = await draftsApi.getDrafts(email)
      setUserDrafts(drafts)
    } catch (e) {
      console.error('Failed to refresh drafts', e)
    }
  }


  // TOASTS
  const addToast = useCallback((message, type = "info") => {

    const id = Date.now() + Math.random()

    setToasts(prev => [
      ...prev,
      { id, message, type }
    ])

    setTimeout(() => {

      setToasts(prev =>
        prev.filter(t => t.id !== id)
      )

    }, 3600)

  }, [])


  const removeToast = useCallback((id) => {

    setToasts(prev =>
      prev.filter(t => t.id !== id)
    )

  }, [])


  const addNotification = useCallback((title, body) => {
    const id = Date.now() + Math.random()
    setNotifications(prev => [{ id, title, body, read: false }, ...prev])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])


  const getCommentsForPost = useCallback((postId) => {

    return comments.filter(
      comment => comment.postId === postId
    )

  }, [comments])


  // FILTERED POSTS
  const drafts = (userDrafts && userDrafts.length > 0)
    ? userDrafts.map(d => ({
        id: d.id,
        title: d.title,
        body: d.content,
        category: d.category || 'Uncategorized',
        status: 'draft',
        tags: [],
        author: d.authorEmail || 'You',
        authorEmail: d.authorEmail,
        createdAt: 'now',
        readTime: 1,
        wordCount: d.content ? d.content.split(' ').length : 0,
        avatarIdx: 0
      }))
    : posts.filter(post => post.status === 'draft')

  const review = posts.filter(
    post => post.status === "review" && (user?.role === "ADMIN" || post.authorEmail === user?.email)
  )

  const published = posts.filter(
    post => post.status === "published" && post.authorEmail === user?.email
  )

  const feedPosts = posts.filter(post => post.status === "published")


  // ANALYTICS
  const totalLikes = posts.reduce(
    (acc, post) => acc + (post.likes || 0),
    0
  )

  const totalComments = posts.reduce(
    (acc, post) => acc + (post.comments || 0),
    0
  )

  const totalReposts = posts.reduce(
    (acc, post) => acc + (post.reposts || 0),
    0
  )

  const totalBookmarks = posts.reduce(
    (acc, post) => acc + (post.bookmarks || 0),
    0
  )


  return (

    <AppContext.Provider
      value={{

        posts,
        feedPosts,
        dispatch,

        comments,
        commentsDispatch,

        getCommentsForPost,

        drafts,
        review,
        published,

        totalLikes,
        totalComments,
        totalReposts,
        totalBookmarks,

        toasts,
        addToast,
        removeToast,

        notifications,
        addNotification,
        removeNotification,

        editingPost,
        setEditingPost,

        refreshDrafts,

        activePostId,
        setActivePostId,
      }}
    >

      {children}

    </AppContext.Provider>
  )
}
