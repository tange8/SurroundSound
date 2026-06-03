// src/hooks/useEventLike.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useEventLike(tmEventId) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !tmEventId) return

    supabase
      .from('event_saves')
      .select('id')
      .eq('user_id', user.id)
      .eq('tm_event_id', tmEventId)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data))
  }, [user, tmEventId])

  async function toggleLike(e) {
    if (e) e.stopPropagation()
    if (!user || !tmEventId || loading) return

    setLoading(true)
    if (liked) {
      await supabase.from('event_saves').delete()
        .eq('user_id', user.id)
        .eq('tm_event_id', tmEventId)
      setLiked(false)
    } else {
      await supabase.from('event_saves').insert({
        user_id: user.id,
        tm_event_id: tmEventId,
      })
      setLiked(true)
    }
    setLoading(false)
  }

  return { liked, toggleLike, isAuthenticated: !!user }
}