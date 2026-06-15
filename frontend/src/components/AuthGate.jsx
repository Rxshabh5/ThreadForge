import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import GetStartedPage from '../pages/GetStartedPage'

export default function AuthGate({ children }) {
  const { user } = useAuth()
  const [mode, setMode] = useState('welcome')
  const location = useLocation()
  const from = location.pathname || '/'

  if (!user) {
    if (mode === 'welcome') {
      return <GetStartedPage onLogin={() => setMode('login')} onRegister={() => setMode('register')} />
    }
    return mode === 'login'
      ? <LoginPage from={from} onSwitch={() => setMode('register')} />
      : <RegisterPage from={from} onSwitch={() => setMode('login')} />
  }

  return children
}
