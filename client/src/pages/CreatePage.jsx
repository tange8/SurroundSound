import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocation as useUserLocation } from '../context/LocationContext'
import { supabase } from '../lib/supabase'
import { fetchEvents } from '../lib/api'
import MediaIcon from '../assets/icons/MediaIcon.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'

function CreatePage() {
  const [title, setTitle] = useState('')
  const [eventSearch, setEventSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventSuggestions, setEventSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [body, setBody] = useState('')
  const [media, setMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { profile, user } = useAuth()
  const { location } = useUserLocation()
  const navigate = useNavigate()
  const debounceRef = useRef(null)
  const eventRef = useRef(null)

  //close suggestions on outside click
  useEffect(() => {
    function handleClick(e) {
      if (eventRef.current && !eventRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Debounced event search as user types
  useEffect(() => {
    if (!eventSearch.trim() || eventSearch.length < 2 || selectedEvent) {
      setEventSuggestions([])
      setShowSuggestions(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      console.log('fetching events for:', eventSearch)
      try {
        const data = await fetchEvents({
          keyword: eventSearch,
          size: 5,
        })
        console.log('suggestions:', data.events?.length) 
        setEventSuggestions(data.events || [])
        setShowSuggestions(true)
      } catch {
        setEventSuggestions([])
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [eventSearch, selectedEvent])

  function handleSelectEvent({ tm_event, tm_artist, tm_venue }) {
    const label = `${tm_artist?.name || tm_event.title} at ${tm_venue?.name || ''}`
    setSelectedEvent({ id: tm_event.ticketmaster_id, label })
    setEventSearch(label)
    setShowSuggestions(false)
  }

  function handleClearEvent() {
    setSelectedEvent(null)
    setEventSearch('')
    setEventSuggestions([])
  }

  const handlePost = async () => {
    if (!title.trim()) {
      setError('Please add a title.')
      return
    }

    setError('')
    setLoading(true)

    try {
      let imageUrl = null

      if (media) {
        const fileExt = media.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, media)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }

      const { error: postError } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          body: body.trim() || null,
          image_url: imageUrl,
          event_title: selectedEvent?.label || null,
        })

      if (postError) throw postError
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
            @{profile?.username ?? '...'}
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

      {/* Event search input */}
      <div ref={eventRef} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for an event (optional)"
            value={eventSearch}
            onChange={(e) => {
              setEventSearch(e.target.value)
              if (selectedEvent) setSelectedEvent(null)
            }}
            className="w-full bg-white/10 text-white placeholder-lavendar/60 font-body text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blurple pr-10"
          />
          {selectedEvent && (
            <button
              onClick={handleClearEvent}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-lavendar/60 hover:text-white text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && eventSuggestions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl z-50"
            style={{
              background: '#00002C',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <ul>
              {eventSuggestions.map(({ tm_event, tm_artist, tm_venue }, i) => (
                <li key={tm_event.ticketmaster_id}>
                  <button
                    onClick={() => handleSelectEvent({ tm_event, tm_artist, tm_venue })}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    {tm_event.image_url && (
                      <img
                        src={tm_event.image_url}
                        alt={tm_event.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-sm font-display truncate">
                        {tm_artist?.name || tm_event.title}
                      </span>
                      <span className="text-white/40 text-xs font-body truncate">
                        {tm_venue?.name} · {tm_event.event_date}
                      </span>
                    </div>
                  </button>
                  {i < eventSuggestions.length - 1 && (
                    <div className="h-px bg-white/10 mx-4" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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

      {error && (
        <p className="text-red-400 font-body text-xs text-center">{error}</p>
      )}

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