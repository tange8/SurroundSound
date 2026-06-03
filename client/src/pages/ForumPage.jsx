import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ForumPost from '../components/ForumPost'

function ForumPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    try {
      // Fetch posts with author profile info
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          body,
          image_url,
          event_title,
          created_at,
          profiles (
            id,
            username,
            avatar_url
          ),
          post_likes (
            user_id
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatTimestamp(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 60) return `${mins} min. ago`
    if (hours < 24) return `${hours} hr. ago`
    return `${days} days ago`
  }

  async function handleLike(postId, isLiked) {
    if (!user) return

    if (isLiked) {
      await supabase.from('post_likes').delete()
        .eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
    }

    // Refresh posts to update like count
    fetchPosts()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-white font-display font-bold text-2xl mb-6">Forum</h1>

      {loading && (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {error && <p className="text-red-400 font-body text-sm">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-white/40 font-body text-sm text-center mt-10">
          No posts yet. Be the first to post!
        </p>
      )}

      {!loading && posts.map(post => {
        const isLiked = post.post_likes?.some(like => like.user_id === user?.id)
        const likeCount = post.post_likes?.length || 0

        return (
          <ForumPost
            key={post.id}
            id={post.id}
            avatar={post.profiles?.avatar_url}
            username={`@${post.profiles?.username || 'unknown'}`}
            timestamp={formatTimestamp(post.created_at)}
            event={post.event_title}
            title={post.title}
            body={post.body}
            image={post.image_url}
            liked={isLiked}
            likeCount={likeCount}
            onLike={() => handleLike(post.id, isLiked)}
            isAuthenticated={!!user}
          />
        )
      })}
    </div>
  )
}

export default ForumPage