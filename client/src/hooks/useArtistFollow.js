// src/hooks/useArtistFollow.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useArtistFollow(tmArtistId, artistName, artistImage) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !tmArtistId) return

    supabase
      .from('artist_follows')
      .select('id')
      .eq('user_id', user.id)
      .eq('tm_artist_id', tmArtistId)
      .maybeSingle()
      .then(({ data }) => setFollowing(!!data))
  }, [user, tmArtistId])

  async function toggleFollow() {
    if (!user || !tmArtistId || loading) return

    setLoading(true)
    if (following) {
      await supabase.from('artist_follows').delete()
        .eq('user_id', user.id)
        .eq('tm_artist_id', tmArtistId)
      setFollowing(false)
    } else {
      await supabase.from('artist_follows').insert({
        user_id: user.id,
        tm_artist_id: tmArtistId,
        artist_name: artistName || null,
        artist_image: artistImage || null,
      })
      setFollowing(true)
    }
    setLoading(false)
  }

  return { following, toggleFollow, isAuthenticated: !!user }
}