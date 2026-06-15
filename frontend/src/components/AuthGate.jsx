import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

export default function AuthGate({ children }) {
  const { user } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const location = useLocation()
  const from = location.pathname || '/'

  if (!user) {
    return mode === 'login'
      ? <LoginPage from={from} onSwitch={() => setMode('register')} />
      : <RegisterPage from={from} onSwitch={() => setMode('login')} />
  }

  return children
}
