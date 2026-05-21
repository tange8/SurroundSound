import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import MediaIcon from '../assets/icons/MediaIcon.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'

function CreatePage() {
  const [title, setTitle] = useState('')
  const [event, setEvent] = useState('')
  const [body, setBody] = useState('')
  const [media, setMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { profile, user } = useAuth()
  const navigate = useNavigate()

  const handlePost = async () => {
    if (!title.trim()) {
      setError('Please add a title.')
      return
    }

    setError('')
    setLoading(true)

    try {
      let imageUrl = null

      // 1. Upload image to Supabase Storage if one was selected
      if (media) {
        const fileExt = media.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, media)

        if (uploadError) throw uploadError

        // Get the public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      // 2. Insert the post into forum_posts
      const { error: postError } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          event_id: event || null,   // null if no event selected
          title: title.trim(),
          body: body.trim() || null,
          image_url: imageUrl,
        })

      if (postError) throw postError

      // 3. Redirect to forum on success
      navigate('/forum')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">

      {/* Title and profile */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4">
        <h1 className="text-white font-display font-bold text-2xl">Create Post</h1>
        <div className="flex items-center gap-2">
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            : <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ProfileIcon className="w-5 h-5 text-white" />
              </div>
          }
          <span className="text-lavendar font-body text-sm">
            @{profile?.username || 'loading...'}
          </span>
        </div>
      </div>

      {/* Post title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-white/10 text-white placeholder-lavendar/60 font-body text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blurple"
      />

      {/* Event dropdown — will be real events from Ticketmaster later */}
      <select
        value={event}
        onChange={(e) => setEvent(e.target.value)}
        className="w-full bg-white/10 text-white font-body text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blurple appearance-none"
      >
        <option value="" className="bg-dark-blue">Choose Event (optional)</option>
        <option value="taylor" className="bg-dark-blue">Taylor Swift at SoFi Stadium</option>
        <option value="sabrina" className="bg-dark-blue">Sabrina Carpenter at Crypto.com Arena</option>
        <option value="harry" className="bg-dark-blue">Harry Styles at SoFi Stadium</option>
      </select>

      {/* Upload Media */}
      <label className="w-full bg-red-orange hover:bg-pink transition-colors text-white font-display text-sm rounded-full px-4 py-3 flex items-center justify-center gap-2 cursor-pointer">
        <MediaIcon className="w-5 h-5" />
        {media ? 'Change Image' : 'Upload Media'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setMedia(e.target.files[0])}
        />
      </label>
      {media && <p className="text-lavendar/70 text-xs font-body px-2">{media.name}</p>}

      {/* Body text */}
      <textarea
        placeholder="What's on your mind?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        className="w-full bg-white/10 text-white placeholder-lavendar/60 font-body text-sm rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blurple resize-none"
      />

      {/* Error */}
      {error && (
        <p className="text-red-400 font-body text-xs text-center">{error}</p>
      )}

      {/* Post button */}
      <button
        onClick={handlePost}
        disabled={loading}
        className="w-1/3 mx-auto bg-red-orange hover:bg-pink transition-colors text-white font-display font-bold text-lg rounded-full py-3 disabled:opacity-50"
      >
        {loading ? 'Posting…' : 'Post'}
      </button>

    </div>
  )
}

export default CreatePage