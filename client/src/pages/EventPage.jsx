import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { fetchEvent } from "../lib/api"
import EventInfoCard from "../components/EventInfoCard.jsx"
import EventPageDetails from "../components/EventPageDetails.jsx"

//formating "2026-06-14" → "June 14, 2026"
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

//formating "19:00:00" → "7:00 PM"
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!eventId) return
    setLoading(true)
    fetchEvent(eventId)
      .then(data => setEventData(data))
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
        address={fullAddress}
        date={formatDate(tm_event?.event_date)}
        time={formatTime(tm_event?.event_time)}
        ticketUrl={tm_event?.buy_tickets_url || '#'}
        directionsUrl={directionsUrl}
        artistPageUrl={tm_artist ? `/artist/${tm_artist.ticketmaster_id}` : '#'}
      />
        <EventPageDetails
        description={tm_event?.description || 'No description available.'}
        ages="All Ages"
        ticketUrl={tm_event?.buy_tickets_url || '#'}
        forumPosts={[]}
        onForumPostClick={(post) => navigate(`/forum?post=${post.id}`)}
        />
    </div>
  )
}

export default EventPage
