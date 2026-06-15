import Sidebar from './Sidebar'
import Header from './Header'
import ToastContainer from './Toast'

export default function AdminLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        {children}
      </main>
      <ToastContainer />
    </div>
  )
}
