import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { fetchEvent } from "../lib/api"
import { supabase } from "../lib/supabase"
import EventInfoCard from "../components/EventInfoCard.jsx"
import EventPageDetails from "../components/EventPageDetails.jsx"

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

function EventPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [eventData, setEventData] = useState(null)
  const [forumPosts, setForumPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!eventId) return
    setLoading(true)

    fetchEvent(eventId)
      .then(async (data) => {
        setEventData(data)

        // Search forum posts by artist name
        const artistName = data.tm_artist?.name || data.tm_event?.title
        if (artistName) {
          const { data: postsData } = await supabase
            .from('forum_posts')
            .select('id, title, event_title, created_at, profiles(username)')
            .ilike('event_title', `%${artistName}%`)
            .order('created_at', { ascending: false })
            .limit(4)
          setForumPosts(postsData || [])
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventId])

  if (loading) return (
    <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
      <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
      <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col mt-10 max-w-4xl mx-auto">
      <p className="text-red-400 font-body">Failed to load event: {error}</p>
    </div>
  )

  const { tm_event, tm_artist, tm_venue } = eventData || {}

  const fullAddress = tm_venue
    ? `${tm_venue.address || ''}, ${tm_venue.city}, ${tm_venue.state} ${tm_venue.zip || ''}`.trim()
    : ''

  const directionsUrl = tm_venue?.latitude && tm_venue?.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${tm_venue.latitude},${tm_venue.longitude}`
    : '#'

  return (
    <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
      <EventInfoCard
        artistName={tm_artist?.name || tm_event?.title}
        artistImage={tm_event?.image_url}
        venue={tm_venue?.name}
        venueId={tm_venue?.ticketmaster_id}
        address={fullAddress}
        date={formatDate(tm_event?.event_date)}
        time={formatTime(tm_event?.event_time)}
        ticketUrl={tm_event?.buy_tickets_url || '#'}
        directionsUrl={directionsUrl}
         tmEventId={tm_event?.ticketmaster_id} 
        artistPageUrl={tm_artist ? `/artist/${tm_artist.ticketmaster_id}` : '#'}
      />
      <EventPageDetails
        description={tm_event?.description || 'No description available.'}
        ages="All Ages"
        ticketUrl={tm_event?.buy_tickets_url || '#'}
        forumPosts={forumPosts}
        onForumPostClick={(post) => navigate(`/forum/${post.id}`)}
      />
    </div>
  )
}

export default EventPage