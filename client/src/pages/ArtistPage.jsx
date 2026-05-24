import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { fetchArtist, fetchEvents } from "../lib/api"
import ArtistInfoCard from "../components/ArtistInfoCard.jsx"
import ArtistPageDetails from "../components/ArtistPageDetails.jsx"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!artistId) return
    setLoading(true)

    // Fetch artist info + their events in parallel
    Promise.all([
      fetchArtist(artistId),
      fetchEvents({ keyword: artistId, size: 10 })
    ])
      .then(([artistData, eventsData]) => {
        setArtist(artistData)
        setEvents(eventsData.events || [])
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

  //shhape events into format for  ArtistPageDetails 
  const upcomingEvents = events.map(({ tm_event, tm_venue }) => ({
    id: tm_event.ticketmaster_id,
    venue: tm_venue?.name || 'TBA',
    city: tm_venue ? `${tm_venue.city}, ${tm_venue.state}` : '',
    date: formatDate(tm_event.event_date),
    time: formatTime(tm_event.event_time),
    nearby: tm_venue?.state === 'CA', // mark CA events as nearby
  }))

  return (
    <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
      <ArtistInfoCard
        artistName={artist?.name}
        artistImage={artist?.image_url}
        genres={artist?.genre ? [artist.genre] : []}
        monthlyListeners={null}
        artistPageUrl={artist?.website_url || '#'}
      />
      <ArtistPageDetails
        description={null}
        genres={artist?.genre ? [artist.genre] : []}
        upcomingEvents={upcomingEvents}
      />
    </div>
  )
}

export default ArtistPage
