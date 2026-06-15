import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bold, Italic, Strikethrough, Heading1, Heading2,
  Quote, List, Code, Code2, Link, Minus,
  Eye, Save, Send, Rocket, X, Check, Hash,
  AlignLeft, Type
} from 'lucide-react'

import { useApp } from '../context/AppContext'
import { postsApi } from '../api/posts'
import { draftsApi } from '../api/drafts'
import { getEmailFromToken } from '../api/auth'

import {
  useAutosave,
  useTextStats,
  useAsync,
  simulateAsync
} from '../hooks'

import PreviewModal from '../components/PreviewModal'
import ReactMarkdown from 'react-markdown'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'

import {
  AVATAR_GRADIENTS,
  CATEGORIES
} from '../data/posts'

const converter = new Showdown.Converter({ tables: true, ghCompatibleHeaderId: true })

export default function EditorPage() {

  const {
    dispatch,
    addToast,
    editingPost,
    setEditingPost,
    refreshDrafts
  } = useApp()

  const navigate = useNavigate()

  const [title, setTitle] = useState(
    editingPost?.title || ''
  )

  const [body, setBody] = useState(
    editingPost?.body || ''
  )

  const [category, setCategory] = useState(
    editingPost?.category || 'Technology'
  )

  const [tagInput, setTagInput] = useState('')

  const [tags, setTags] = useState(
    editingPost?.tags || []
  )

  const [preview, setPreview] = useState(false)
  const [previewSplit, setPreviewSplit] = useState(false)
  const [mdeTab, setMdeTab] = useState('write')

  const bodyRef = useRef(null)

  const { wordCount, readTime } =
    useTextStats(body)

  const { loading, run } = useAsync()

  const autosaveStatus = useAutosave(async () => {
    try {
      if (!title.trim() && !body.trim()) return
      await draftsApi.saveDraft({ id: editingPost?.id, title: title.trim(), content: body.trim(), category, authorEmail: getEmailFromToken() })
    } catch (e) {
      console.error('Autosave failed', e)
    }
  }, [title, body, tags, category])


  useEffect(() => {

    const handler = (e) => {

      if (
        (e.ctrlKey || e.metaKey)
      ) {

        if (e.key === 'b') {

          e.preventDefault()
          insertFormat('**', '**')
        }

        if (e.key === 'i') {

          e.preventDefault()
          insertFormat('_', '_')
        }
      }
    }

    window.addEventListener(
      'keydown',
      handler
    )

    return () =>
      window.removeEventListener(
        'keydown',
        handler
      )

  }, [body])

  const insertFormat = useCallback(
    (prefix, suffix) => {

      const el = bodyRef.current

      if (!el) return

      const {
        selectionStart: s,
        selectionEnd: e
      } = el

      const selected =
        body.substring(s, e)

      const newBody =
        body.substring(0, s) +
        prefix +
        selected +
        suffix +
        body.substring(e)

      setBody(newBody)

    },
    [body]
  )

  const addTag = () => {

    const cleaned =
      tagInput
        .trim()
        .toLowerCase()

    if (
      cleaned &&
      !tags.includes(cleaned)
    ) {

      setTags(prev => [
        ...prev,
        cleaned
      ])

      setTagInput('')
    }
  }

  const buildPost = (status) => ({

    id:
      editingPost?.id ||
      Date.now(),

    title: title.trim(),

    body: body.trim(),

    category,

    tags,

    status,

    author: 'You',

    authorHandle: '@you',

    likes:
      editingPost?.likes || 0,

    comments:
      editingPost?.comments || 0,

    reposts:
      editingPost?.reposts || 0,

    bookmarks:
      editingPost?.bookmarks || 0,

    liked:
      editingPost?.liked || false,

    bookmarked:
      editingPost?.bookmarked || false,

    reposted:
      editingPost?.reposted || false,

    createdAt:
      editingPost?.createdAt ||
      'Just now',

    readTime,

    wordCount,

    avatarIdx:
      editingPost?.avatarIdx ??
      (
        Date.now() %
        AVATAR_GRADIENTS.length
      ),
  })

  const handleSave = async (
    status,
    toastMsg,
    successPath
  ) => {

    if (!title.trim()) {

      addToast(
        'Add a title first!',
        'error'
      )

      return
    }

    if (
      status === 'published' &&
      body.length < 50
    ) {

      addToast(
        'Need at least 50 characters to publish!',
        'error'
      )

      return
    }

    await run(async () => {

      await simulateAsync(
        status === 'published'
          ? 1800
          : 1000
      )

      const post =
        buildPost(status)

      try {

        if (status === 'published') {

          if (editingPost && editingPost.status === 'draft') {

            // publish draft via draftsApi
            const publishedPost = await draftsApi.publishDraft(editingPost.id)

            dispatch({
              type: 'ADD_POST',
              post: {
                ...publishedPost,
                body: publishedPost.content,
                status: 'published'
              }
            })

            if (refreshDrafts) {
              await refreshDrafts()
            }

          } else if (editingPost) {

            const updatedPost = await postsApi.updatePost(editingPost.id, {
              title: post.title,
              content: post.body,
              category: post.category
            })

            dispatch({ type: 'UPDATE_POST', id: editingPost.id, updates: updatedPost })

          } else {

            const createdPost = await postsApi.createPost({
              title: post.title,
              content: post.body,
              category: post.category
            })

            dispatch({ type: 'ADD_POST', post: createdPost })
          }

        } else if (status === 'draft') {

          // save draft via gateway
          const saved = await draftsApi.saveDraft({
            title: post.title,
            content: post.body,
            category: post.category,
            authorEmail: getEmailFromToken(),
            id: editingPost?.id
          })

          // set editing post to saved draft
          setEditingPost({ ...post, id: saved.id, status: 'draft' })

          if (refreshDrafts) {
            await refreshDrafts()
          }
        }

        addToast(toastMsg, 'success')

        setEditingPost(null)

        navigate(successPath || '/')

      } catch (error) {

        console.error(error)

        addToast('Failed to save post!', 'error')
      }
    })
  }

  const handleSaveDraft = async () => {
    await handleSave('draft', 'Draft saved', '/drafts')
  }

  const previewPost = {
    ...buildPost('draft'),
    status:
      editingPost?.status ||
      'draft',
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          {editingPost
            ? 'Editing Post'
            : 'New Post'}
        </div>

        <div className="topbar-actions">

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className={`save-dot ${autosaveStatus === 'saving' ? 'saving' : autosaveStatus === 'saved' ? 'saved' : ''}`} title={autosaveStatus} />
            <button className="btn btn-ghost btn-sm" onClick={handleSaveDraft}><Save size={13} /> Save Draft</button>
            <button className={`btn btn-ghost btn-sm ${previewSplit ? 'active' : ''}`} onClick={() => setPreviewSplit(s => !s)}><Eye size={13} /> Split</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPreview(true)}><Eye size={13} /> Preview</button>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleSave('published','🚀 Published!','/')}
            disabled={loading}
          >
            {loading ? 'Publishing...' : <><Rocket size={13} /> Publish</>}
          </button>
        </div>
      </div>

      <div className="page-body">
        <input
          className="form-input"
          placeholder="Post title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {previewSplit ? (
          <div className="editor-layout">
            <div className="editor-main">
              <ReactMde
                value={body}
                onChange={setBody}
                selectedTab={mdeTab}
                onTabChange={setMdeTab}
                generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
                childProps={{ textArea: { ref: bodyRef, className: 'editor-body', placeholder: 'Write your content in Markdown...' } }}
              />
            </div>
            <div className="panel">
              <div className="panel-header">Preview</div>
              <div className="panel-body" style={{ maxHeight: 520, overflow: 'auto' }}>
                <ReactMarkdown>{body || 'Nothing to preview'}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <ReactMde
              value={body}
              onChange={setBody}
              selectedTab={mdeTab}
              onTabChange={setMdeTab}
              generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
              childProps={{ textArea: { ref: bodyRef, className: 'editor-body', placeholder: 'Write your content...' } }}
            />
          </div>
        )}

        <select
          className="form-select"
          value={category}
          onChange={e =>
            setCategory(e.target.value)
          }
        >
          {CATEGORIES.map(c => (
            <option key={c}>
              {c}
            </option>
          ))}
        </select>

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 12
          }}
        >

          <input
            className="form-input"
            placeholder="Add tag..."
            value={tagInput}
            onChange={e =>
              setTagInput(e.target.value)
            }
          />

          <button
            className="btn btn-ghost"
            onClick={addTag}
          >
            Add
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }}
        >
          {tags.map(tag => (
            <div
              key={tag}
              className="tag-item"
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>

      {preview && (
        <PreviewModal
          post={previewPost}
          onClose={() => setPreview(false)}
        />
      )}
    </>
  )
}