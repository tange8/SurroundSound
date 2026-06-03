import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { fetchVenue, fetchEvents } from "../lib/api"
import VenueInfoCard from "../components/VenueInfoCard.jsx"
import VenuePageDetails from "../components/VenuePageDetails.jsx"

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

function VenuePage() {
  const { venueId } = useParams()
  const [venue, setVenue] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!venueId) return
    setLoading(true)

    Promise.all([
      fetchVenue(venueId),
      fetchEvents({ venueId, size: 10 })
    ])
      .then(([venueData, eventsData]) => {
        setVenue(venueData)
        setEvents(eventsData.events || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [venueId])

  if (loading) return (
    <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
      <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
      <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col mt-10 max-w-4xl mx-auto">
      <p className="text-red-400 font-body">Failed to load venue: {error}</p>
    </div>
  )

  const fullAddress = [
  venue?.address,
  venue?.city,
  venue?.state,
  venue?.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const directionsUrl = venue?.latitude && venue?.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`
    : '#'

  const upcomingEvents = events.map(({ tm_event, tm_artist }) => ({
    id: tm_event.ticketmaster_id,
    artistName: tm_artist?.name || tm_event.title,
    artistImage: tm_event.image_url,
    date: formatDate(tm_event.event_date),
    time: formatTime(tm_event.event_time),
  }))

  return (
    <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
      <VenueInfoCard
        venueName={venue?.name}
        venueImage={null}
        address={fullAddress}
        website={venue?.website_url || null}
        phone={null}
        capacity={null}
        directionsUrl={directionsUrl}
      />
      <VenuePageDetails
        description={null}
        upcomingEvents={upcomingEvents}
      />
    </div>
  )
}

export default VenuePage