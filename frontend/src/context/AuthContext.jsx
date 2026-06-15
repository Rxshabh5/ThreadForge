import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react'

import axios from 'axios'

export const AuthContext =
  createContext(null)

export const useAuth = () =>
  useContext(AuthContext)

const API_URL =
  'http://localhost:8000'


export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null)

  const [prevUser, setPrevUser] = useState(null)

  const [authError, setAuthError] =
    useState('')


  useEffect(() => {

    const token =
      localStorage.getItem('token')

    const email =
      localStorage.getItem('email')

    const role =
      localStorage.getItem('role')

    const name =
      localStorage.getItem('name')

    if (
      token &&
      email &&
      role
    ) {

      setUser({
        email,
        role,
        name,
        handle: `@${
          email.split('@')[0]
        }`
      })
    }

  }, [])


  const login = useCallback(
    async (
      email,
      password
    ) => {

      try {

        setAuthError('')

        const response =
          await axios.post(
            `${API_URL}/auth/login`,
            {
              email,
              password
            }
          )

        const data =
          response.data

        if (!data.token) {

          setAuthError(
            'Invalid email or password'
          )

          return { ok: false }
        }

        localStorage.setItem(
          'token',
          data.token
        )

        localStorage.setItem(
          'email',
          email
        )

        localStorage.setItem(
          'role',
          data.role
        )

        localStorage.setItem(
          'name',
          data.username || email.split('@')[0]
        )

        const loggedUser = {
          email,
          role: data.role,
          name: data.username || email.split('@')[0],
          handle: `@${email.split('@')[0]}`
        }

        setUser(loggedUser)

        return { ok: true }

      } catch (error) {

        console.error(error)

        setAuthError(
          'Invalid email or password'
        )

        return { ok: false }
      }
    },
    []
  )


  const register = useCallback(
    async (
      name,
      email,
      password,
      role = 'USER'
    ) => {

      try {

        setAuthError('')

        await axios.post(
          `${API_URL}/auth/register`,
          {
            username: name,
            email,
            password,
            role
          }
        )

        return await login(
          email,
          password
        )

      } catch (error) {

        console.error(error)

        setAuthError(
          'Registration failed'
        )

        return { ok: false }
      }
    },
    [login]
  )


  const logout = useCallback(() => {

    localStorage.removeItem(
      'token'
    )

    localStorage.removeItem(
      'email'
    )

    localStorage.removeItem(
      'role'
    )

    localStorage.removeItem(
      'name'
    )

    setUser(null)
    setPrevUser(null)

    setAuthError('')

  }, [])


  const updateProfile =
    useCallback((updates) => {

      setUser(prev =>
        prev
          ? {
              ...prev,
              ...updates
            }
          : prev
      )

    }, [])

    const impersonateUser = useCallback((target) => {
      if (!target) return
      setPrevUser(user)
      const impersonated = {
        email: target.email || target.username || '',
        role: target.role || 'USER',
        name: target.username || target.name || (target.email ? target.email.split('@')[0] : 'Impersonated'),
        handle: `@${(target.username || (target.email ? target.email.split('@')[0] : 'user'))}`
      }
      localStorage.setItem('email', impersonated.email)
      localStorage.setItem('role', impersonated.role)
      localStorage.setItem('name', impersonated.name)
      setUser(impersonated)
    }, [user])

    const stopImpersonation = useCallback(() => {
      if (!prevUser) return
      localStorage.setItem('email', prevUser.email)
      localStorage.setItem('role', prevUser.role)
      localStorage.setItem('name', prevUser.name)
      setUser(prevUser)
      setPrevUser(null)
    }, [prevUser])


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        authError,
        setAuthError,
        impersonateUser,
        stopImpersonation,
        prevUser,
        isImpersonating: Boolean(prevUser)
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}
