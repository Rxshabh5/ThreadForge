import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider }  from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import AuthGate         from './components/AuthGate'
import Sidebar          from './components/Sidebar'
import ToastContainer   from './components/Toast'
import Header           from './components/Header'
import AdminLayout      from './components/AdminLayout'
import FeedPage         from './pages/FeedPage'
import EditorPage       from './pages/EditorPage'
import DraftsPage       from './pages/DraftsPage'
import ReviewPage       from './pages/ReviewPage'
import PublishedPage    from './pages/PublishedPage'
import AnalyticsPage    from './pages/AnalyticsPage'
import ProfilePage      from './pages/ProfilePage'
import AdminPage        from './pages/AdminPage'
import SearchPage       from './pages/SearchPage'

function AppShell() {
  const location = useLocation()
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
          <Routes location={location} key={location.pathname}>
            <Route path="/admin" element={<AdminLayout><AdminPage /></AdminLayout>} />
            <Route path="/admin/*" element={<AdminLayout><AdminPage /></AdminLayout>} />

            <Route path="/" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <FeedPage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/editor" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <EditorPage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/drafts" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <DraftsPage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/search" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <SearchPage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/review" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <ReviewPage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/published" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <PublishedPage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/analytics" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <AnalyticsPage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/profile" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <ProfilePage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="/profile/:profileId" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Header />
                  <ProfilePage />
                </main>
                <ToastContainer />
              </div>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AuthGate>
          <AppShell />
        </AuthGate>
      </AppProvider>
    </AuthProvider>
  )
}
