import { useState, useEffect, useRef, useCallback } from 'react'

// Autosave hook — calls saveFn after delay whenever deps change
export function useAutosave(saveFn, deps, delay = 1600) {
  const [status, setStatus] = useState('idle') // idle | saving | saved
  const timer = useRef(null)
  const isFirst = useRef(true)

  useEffect(() => {
    
    if (isFirst.current) { isFirst.current = false; return }
    if (deps.every(d => !d)) return

    clearTimeout(timer.current)
    setStatus('saving')

    timer.current = setTimeout(async () => {
      try {
        await saveFn()
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 3000)
      } catch {
        setStatus('idle')
      }
    }, delay)

    return () => clearTimeout(timer.current)

  }, deps)

  return status
}


export function useTextStats(body) {
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
  const readTime  = Math.max(1, Math.ceil(wordCount / 200))
  const charCount = body.length
  return { wordCount, readTime, charCount }
}


export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// Async action with loading state
export function useAsync() {
  const [loading, setLoading] = useState(false)

  const run = useCallback(async (fn) => {
    setLoading(true)
    try {
      const result = await fn()
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, run }
}

// Simulate network delay
export const simulateAsync = (ms = 1200) => new Promise(r => setTimeout(r, ms))
