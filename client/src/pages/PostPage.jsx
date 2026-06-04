import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ForumPost from '../components/ForumPost'

function PostPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!postId) return
    setLoading(true)

    supabase
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
      .eq('id', postId)
      .single()
      .then(({ data, error }) => {
        if (error) throw error
        setPost(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [postId])

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
    // Refresh post to update like count
    const { data } = await supabase
      .from('forum_posts')
      .select(`id, title, body, image_url, event_title, created_at, profiles(id, username, avatar_url), post_likes(user_id)`)
      .eq('id', postId)
      .single()
    if (data) setPost(data)
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
    </div>
  )

  if (error || !post) return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <p className="text-red-400 font-body">Post not found.</p>
    </div>
  )

  const isLiked = post.post_likes?.some(like => like.user_id === user?.id)
  const likeCount = post.post_likes?.length || 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-lavendar/60 font-body text-sm hover:text-white transition-colors mb-6"
      >
        ← Back
      </button>

      <ForumPost
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
    </div>
  )
}

export default PostPage