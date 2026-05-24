// src/hooks/useEvents.js
//reusable hook for fetching events 
import { useState, useEffect } from 'react'
import { fetchEvents } from '../lib/api'

export function useEvents({ city = 'Los Angeles', stateCode = 'CA', keyword, size = 20 } = {}) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchEvents({ city, stateCode, keyword, size })
      .then(data => {
        if (!cancelled) {
          setEvents(data.events || [])
          setTotal(data.total || 0)
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [city, stateCode, keyword, size])

  return { events, loading, error, total }
}