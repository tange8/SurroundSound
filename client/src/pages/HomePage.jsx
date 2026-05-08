import DashCard from '../components/DashCard'
import HighlightedEvent from '../components/HighlightedEvent'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import VenueCard from '../components/VenueCard'


const featuredEvent = {
  image: '/src/assets/TaylorSwift.png',
  artist: 'Taylor Swift',
  eventId: '1',                // will be the real event id from the db later
}

const placeholderCard = {
  image: '/src/assets/TaylorSwift.png', 
  date: 'Sunday, June 14, 2026',
  time: '7:00 PM',
  artist: 'Taylor Swift',
  venue: 'at SoFi Stadium',
  liked: false,
}

const placeholderVenue = {
  image: '/src/assets/Observatory.png',
  name: 'The Observatory',
  location: 'Santa Ana, CA'
}

function HomePage() {
    useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('Supabase connected:', data)
    })
  }, [])

  return (
    //background gradient
    <div className="min-h-screen">

      {/* Featured Event */}
      <HighlightedEvent {...featuredEvent} />

      {/* Trending Now */}
      <section className="px-8 py-6">
        <h2 className="text-white font-display text-lg mb-4 italic">Trending Now</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(10)].map((_, i) => (
            <DashCard key={i} {...placeholderCard} />
          ))}
        </div>
      </section>

      {/* Venues Near You */}
      <section className="px-4 md:px-8 py-6">
        <h2 className="text-white font-display text-lg mb-4 italic">
          Venues Near You
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[...Array(10)].map((_, i) => (
            <VenueCard key={i} {...placeholderVenue} />
          ))}
        </div>
      </section>

      {/* Your Favorite Artists */}
      <section className="px-8 py-6">
        <h2 className="text-white font-display text-lg mb-4 italic">Your Favorite Artists</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[...Array(10)].map((_, i) => (
            <DashCard key={i} {...placeholderCard} />
          ))}
        </div>
      </section>

    </div>
  )
}

export default HomePage