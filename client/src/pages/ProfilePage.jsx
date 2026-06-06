import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchEvent } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import ProfileCard from '../components/ProfileCard'
import SavedEventCard from '../components/SavedEventCard'
import FollowedArtistCard from '../components/FollowedArtistCard'
import UserForumPostCard from '../components/UserForumPostCard'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [savedEvents, setSavedEvents] = useState([])
  const [followedArtists, setFollowedArtists] = useState([])
  const [forumPosts, setForumPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [editUsername, setEditUsername] = useState('')
  const [editDisplayName, setEditDisplayName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editLocation, setEditLocation] = useState('')

  useEffect(() => {
    if (!user) return
    loadProfile()
    loadSavedEvents()
    loadFollowedArtists()
    loadForumPosts()
  }, [user])

  async function loadProfile() {
    const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, avatar_url, location')
        .eq('id', user.id)
        .single()
    if (data) {
      setProfile(data)
      setEditUsername(data.username || '')
      setEditDisplayName(data.display_name || '')
      setEditBio(data.bio || '')
      setEditLocation(data.location || '')
    }
    setLoading(false)
  }

  async function loadSavedEvents() {
    const { data } = await supabase
        .from('event_saves')
        .select('id, tm_event_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    if (!data) return

    const enriched = await Promise.all(
        data.map(async (save) => {
          try {
            const event = await fetchEvent(save.tm_event_id)
            return {
              id: save.id,
              tm_event_id: save.tm_event_id,
              title: event.tm_event?.title || null,
              event_date: event.tm_event?.event_date || null,
              image_url: event.tm_event?.image_url || null,
              venue_name: event.tm_venue?.name || null,
              city: event.tm_venue?.city || null,
              state: event.tm_venue?.state || null,
            }
          } catch {
            return { id: save.id, tm_event_id: save.tm_event_id }
          }
        })
    )
    setSavedEvents(enriched)
  }

  async function loadFollowedArtists() {
    const { data } = await supabase
        .from('artist_follows')
        .select('id, tm_artist_id, artist_name, artist_image')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    if (data) setFollowedArtists(data)
  }

  async function handleSaveProfile() {
    setSaving(true)
    setSaveError(null)
    const { error } = await supabase.from('profiles')
        .update({ username: editUsername, display_name: editDisplayName, bio: editBio, location: editLocation })
        .eq('id', user.id)
    if (error) setSaveError(error.message)
    else {
      setProfile(p => ({ ...p, username: editUsername, display_name: editDisplayName, bio: editBio, location: editLocation }))
      setEditing(false)
    }
    setSaving(false)
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const avatar_url = data.publicUrl + `?t=${Date.now()}`
      await supabase.from('profiles').update({ avatar_url }).eq('id', user.id)
      setProfile(p => ({ ...p, avatar_url }))
    }
    setUploadingAvatar(false)
  }

  async function handleUnsave(id) {
    await supabase.from('event_saves').delete().eq('id', id)
    setSavedEvents(prev => prev.filter(e => e.id !== id))
  }

  async function loadForumPosts() {
    const { data } = await supabase
        .from('forum_posts')
        .select('id, title, body, image_url, event_title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    if (data) setForumPosts(data)
  }

  async function handleDeletePost(id) {
    await supabase.from('forum_posts').delete().eq('id', id)
    setForumPosts(prev => prev.filter(p => p.id !== id))
  }

  async function handleUnfollow(id) {
    await supabase.from('artist_follows').delete().eq('id', id)
    setFollowedArtists(prev => prev.filter(a => a.id !== id))
  }

  if (!user) return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="font-body text-sm" style={{ color: '#8890cc' }}>
          Please{' '}
          <button onClick={() => navigate('/login')} className="underline" style={{ color: '#CCD0FF' }}>
            sign in
          </button>{' '}
          to view your profile.
        </p>
      </div>
  )

  if (loading) return (
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl h-24" style={{ background: '#00002C' }} />
        ))}
      </div>
  )

  return (
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">

        <ProfileCard
            profile={profile}
            editing={editing} setEditing={setEditing}
            uploadingAvatar={uploadingAvatar} onAvatarUpload={handleAvatarUpload}
            editDisplayName={editDisplayName} setEditDisplayName={setEditDisplayName}
            editUsername={editUsername} setEditUsername={setEditUsername}
            editLocation={editLocation} setEditLocation={setEditLocation}
            editBio={editBio} setEditBio={setEditBio}
            onSave={handleSaveProfile}
            saving={saving} saveError={saveError} setSaveError={setSaveError}
        />

        {/* Following Artists */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg" style={{ color: '#CCD0FF' }}>
              Following
              {followedArtists.length > 0 && (
                  <span className="ml-2 font-body font-normal text-sm" style={{ color: '#6670aa' }}>
                {followedArtists.length}
              </span>
              )}
            </h2>
          </div>

          {followedArtists.length === 0 ? (
              <div className="rounded-2xl px-6 py-8 text-center" style={{ background: '#000013', border: '1px solid #4133FF' }}>
                <p className="font-body text-sm" style={{ color: '#6670aa' }}>Not following any artists yet.</p>
              </div>
          ) : (
              <div
                  className="flex gap-6 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#4133FF #000013' }}
              >
                {followedArtists.map(artist => (
                    <FollowedArtistCard key={artist.id} artist={artist} onUnfollow={handleUnfollow} />
                ))}
              </div>
          )}
        </div>

        {/* Saved Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg" style={{ color: '#CCD0FF' }}>
              Saved Events
              {savedEvents.length > 0 && (
                  <span className="ml-2 font-body font-normal text-sm" style={{ color: '#6670aa' }}>
                {savedEvents.length}
              </span>
              )}
            </h2>
            {savedEvents.length > 0 && (
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-white bg-red-orange text-base transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-lg font-body"
                >
                  + Find more
                </button>
            )}
          </div>

          {savedEvents.length === 0 ? (
              <div className="rounded-2xl px-6 py-12 text-center" style={{ background: '#000013', border: '1px solid #4133FF' }}>
                <p className="text-2xl mb-2">🎵</p>
                <p className="font-body text-sm mb-4" style={{ color: '#6670aa' }}>No saved events yet.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mx-auto block px-6 py-3 rounded-full text-white bg-red-orange text-base transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-lg font-body"
                >
                  Browse events →
                </button>
              </div>
          ) : (
              <div
                  className="flex flex-col gap-4 overflow-y-auto pr-1"
                  style={{ maxHeight: '480px', scrollbarWidth: 'thin', scrollbarColor: '#4133FF #000013' }}
              >
                {savedEvents.map(event => (
                    <SavedEventCard key={event.id} event={event} onUnsave={handleUnsave} />
                ))}
              </div>
          )}
        </div>

        {/* Forum Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg" style={{ color: '#CCD0FF' }}>
              My Posts
              {forumPosts.length > 0 && (
                  <span className="ml-2 font-body font-normal text-sm" style={{ color: '#6670aa' }}>
                {forumPosts.length}
              </span>
              )}
            </h2>
            <button
                onClick={() => navigate('/create')}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white bg-red-orange text-base transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-lg font-body"
            >
              + New Post
            </button>
          </div>

          {forumPosts.length === 0 ? (
              <div className="rounded-2xl px-6 py-8 text-center" style={{ background: '#000013', border: '1px solid #4133FF' }}>
                <p className="font-body text-sm" style={{ color: '#6670aa' }}>No posts yet.</p>
              </div>
          ) : (
              <div
                  className="flex flex-col gap-4 overflow-y-auto pr-1"
                  style={{ maxHeight: '480px', scrollbarWidth: 'thin', scrollbarColor: '#4133FF #000013' }}
              >
                {forumPosts.map(post => (
                    <UserForumPostCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))}
              </div>
          )}
        </div>

      </div>
  )
}