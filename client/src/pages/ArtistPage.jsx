import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import ArtistInfoCard from "../components/ArtistInfoCard.jsx"
import ArtistPageDetails from "../components/ArtistPageDetails.jsx"
import { fetchArtist, fetchEvents, fetchArtistBio } from "../lib/api"


function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const date = new Date()
  date.setHours(+h, +m)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function ArtistPage() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const [artist, setArtist] = useState(null)
  const [events, setEvents] = useState([])
  const [forumPosts, setForumPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bio, setBio] = useState(null)

  useEffect(() => {
    if (!artistId) return
    setLoading(true)

    //fetch artist first to get name, then fetch events + posts in parallel
    fetchArtist(artistId)
      .then(async (artistData) => {
        setArtist(artistData)
        fetchArtistBio({ name: artistData.name }).then(d => setBio(d.bio))

        const [eventsData, { data: postsData }] = await Promise.all([
          fetchEvents({ attractionId: artistId, size: 10 }),
          supabase
            .from('forum_posts')
            .select('id, title, event_title, created_at, profiles(username)')
            .ilike('event_title', `%${artistData.name}%`)
            .order('created_at', { ascending: false })
            .limit(4)
        ])
        console.log('artist name:', artistData.name)
      console.log('forum posts:', postsData)

        setEvents(eventsData.events || [])
        setForumPosts(postsData || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [artistId])

  if (loading) return (
    <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
      <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
      <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col mt-10 max-w-4xl mx-auto">
      <p className="text-red-400 font-body">Failed to load artist: {error}</p>
    </div>
  )

  const upcomingEvents = events.map(({ tm_event, tm_venue }) => ({
    id: tm_event.ticketmaster_id,
    venue: tm_venue?.name || 'TBA',
    city: tm_venue ? `${tm_venue.city}, ${tm_venue.state}` : '',
    date: formatDate(tm_event.event_date),
    time: formatTime(tm_event.event_time),
    nearby: tm_venue?.state === 'CA',
  }))

  return (
    <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
      <ArtistInfoCard
        artistName={artist?.name}
        artistImage={artist?.image_url}
        genres={artist?.genre ? [artist.genre] : []}
        monthlyListeners={null}
        artistPageUrl={artist?.website_url || '#'}
        tmArtistId={artist?.ticketmaster_id}
      />
      <ArtistPageDetails
          description={bio}
          genres={artist?.genre ? [artist.genre] : []}
          upcomingEvents={upcomingEvents}
          forumPosts={forumPosts}
      />
    </div>
  )
}

export default ArtistPage