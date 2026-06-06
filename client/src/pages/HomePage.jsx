import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useEvents } from '../hooks/useEvents'
import DashCard from '../components/DashCard'
import HighlightedEvent from '../components/HighlightedEvent'
import VenueCard from '../components/VenueCard'
import { useLocation as useUserLocation } from '../context/LocationContext'

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function formatTime(timeStr) {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':')
    const date = new Date()
    date.setHours(+h, +m)
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })
}

function getUniqueVenues(events) {
    const seen = new Set()
    return events
        .filter(({ tm_venue }) => {
            if (!tm_venue || seen.has(tm_venue.ticketmaster_id)) return false
            seen.add(tm_venue.ticketmaster_id)
            return true
        })
        .slice(0, 10)
}

function HorizontalScroll({ children, className = '' }) {
    const scrollRef = useRef(null)

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        const handler = (e) => {
            e.preventDefault()
            el.scrollLeft += (e.deltaY + e.deltaX) * 3
        }
        el.addEventListener('wheel', handler, { passive: false })
        return () => el.removeEventListener('wheel', handler)
    }, [])

    return (
        <div
            ref={scrollRef}
            className={`flex gap-4 overflow-x-auto scroll-smooth pb-2 ${className}`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#4133FF #000013' }}
        >
            {children}
        </div>
    )
}

function HomePage() {
    const navigate = useNavigate()
    const { location } = useUserLocation()

    const { events, loading, error } = useEvents({
        city: location.city,
        stateCode: location.stateCode,
        size: 20,
    })

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            console.log('Supabase connected:', data)
        })
    }, [])

    const featuredEvent = events[0] || null
    const uniqueVenues = getUniqueVenues(events)

    return (
        <div className="min-h-screen">
            {/* Featured Event */}
            {featuredEvent ? (
                <HighlightedEvent
                    image={featuredEvent.tm_event.image_url}
                    artist={featuredEvent.tm_artist?.name || featuredEvent.tm_event.title}
                    eventId={featuredEvent.tm_event.ticketmaster_id}
                />
            ) : (
                <div className="h-64 bg-white/5 animate-pulse rounded-xl mx-8 mt-4" />
            )}

            {/* Trending Now */}
            <section className="px-8 py-6">
                <h2 className="text-white font-display text-lg mb-4 italic">Trending Now</h2>

                {loading && (
                    <div className="flex gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-36 h-52 bg-white/5 animate-pulse rounded-xl shrink-0" />
                        ))}
                    </div>
                )}

                {error && <p className="text-red-400 font-body text-sm">{error}</p>}

                {!loading && !error && (
                    <HorizontalScroll>
                        {events.map(({ tm_event, tm_artist, tm_venue }) => (
                            <DashCard
                                key={tm_event.ticketmaster_id}
                                image={tm_event.image_url}
                                date={formatDate(tm_event.event_date)}
                                time={formatTime(tm_event.event_time)}
                                artist={tm_artist?.name || tm_event.title}
                                venue={tm_venue ? `at ${tm_venue.name}` : ''}
                                liked={false}
                                eventId={tm_event.ticketmaster_id}
                                artistId={tm_artist?.ticketmaster_id}
                                onClick={() => navigate(`/event/${tm_event.ticketmaster_id}`)}
                            />
                        ))}
                    </HorizontalScroll>
                )}
            </section>

            {/* Venues Near You */}
            <section className="px-4 md:px-8 py-6">
                <h2 className="text-white font-display text-lg mb-4 italic">Venues Near You</h2>

                <HorizontalScroll>
                    {uniqueVenues.map(({ tm_event, tm_venue }) => (
                        <VenueCard
                            key={tm_venue.ticketmaster_id}
                            image={tm_venue.image_url || tm_event.image_url}
                            name={tm_venue.name}
                            location={`${tm_venue.city}, ${tm_venue.state}`}
                            city={tm_venue.city}
                            state={tm_venue.state}
                            venueId={tm_venue.ticketmaster_id}
                            onClick={() => navigate(`/venue/${tm_venue.ticketmaster_id}`)}
                        />
                    ))}
                </HorizontalScroll>
            </section>

            {/* Explore Artists */}
            <section className="px-8 py-6">
                <h2 className="text-white font-display text-lg mb-4 italic">Explore Artists</h2>

                <HorizontalScroll>
                    {!loading &&
                        events.slice(0, 10).map(({ tm_event, tm_artist }) => (
                            <DashCard
                                key={tm_artist?.ticketmaster_id || tm_event.ticketmaster_id}
                                image={tm_event.image_url}
                                artist={tm_artist?.name || tm_event.title}
                                liked={false}
                                artistId={tm_artist?.ticketmaster_id}
                                variant="artist"
                                onClick={() => navigate(`/artist/${tm_artist?.ticketmaster_id}`)}
                            />
                        ))}
                </HorizontalScroll>
            </section>
        </div>
    )
}

export default HomePage