# 🧵 ThreadForge v2 — Content Studio

A production-grade Content Publishing SPA built with **React 18 + Vite + SWC**.

## 🚀 Quick Start

```bash
cd threadforge
npm install
npm run dev
```

Open **http://localhost:5173**

### Demo Login
- Email: `alex@threadforge.io`  
- Password: `password123`

## ✨ v2 New Features

### 🔐 Authentication System
- Login page with animated background orbs + grid
- Register page with password strength meter
- Demo users with persistent session during app lifetime
- Logout from sidebar
- AuthGate wrapper protecting all routes

### 💬 Working Comments
- Full comment thread per post
- Nested replies (one level deep)
- Like/unlike comments and replies
- Delete your own comments/replies  
- Real-time count updates on post cards
- Ctrl+Enter to submit

### 👤 Profile Page
- Cover gradient + large avatar
- Editable profile (name, bio, location, website) inline
- Verified badge for verified accounts
- Stats bar: posts, likes, comments, reposts, bookmarks, followers/following
- Achievement badges (earned vs locked)
- Tabbed content: All Posts / Bookmarks / Liked

### Other Enhancements
- Bookmark toast notification
- Repost toggle (with undo toast)  
- Heart/Bookmark icons fill on active state
- Logout button in sidebar
- All action buttons have proper feedback

## 📁 Structure

```
src/
├── components/
│   ├── AuthGate.jsx        ← Protects app behind login
│   ├── CommentsModal.jsx   ← Full comment thread modal
│   ├── ConfirmModal.jsx
│   ├── PostCard.jsx        ← Updated with comments integration
│   ├── PreviewModal.jsx
│   ├── Sidebar.jsx         ← Updated with profile + logout
│   ├── StatusBadge.jsx
│   └── Toast.jsx
├── context/
│   ├── AppContext.jsx      ← + comments reducer, getCommentsForPost
│   └── AuthContext.jsx     ← NEW: login, register, logout, updateProfile
├── data/
│   └── posts.js            ← + INITIAL_COMMENTS seed data
├── hooks/index.js
├── pages/
│   ├── LoginPage.jsx       ← NEW
│   ├── RegisterPage.jsx    ← NEW
│   ├── ProfilePage.jsx     ← NEW
│   ├── FeedPage.jsx
│   ├── EditorPage.jsx
│   ├── DraftsPage.jsx
│   ├── ReviewPage.jsx
│   ├── PublishedPage.jsx
│   ├── AnalyticsPage.jsx
│   └── SettingsPage.jsx
└── styles/globals.css      ← + auth, comments, profile styles
```

## 🛠 Tech Stack
React 18 · Vite 5 · @vitejs/plugin-react-swc · React Router v6 · Lucide React
