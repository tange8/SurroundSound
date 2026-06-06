import { useNavigate } from 'react-router-dom'
import RedHeart from '../assets/icons/RedHeart.svg?react'
import WhiteHeart from '../assets/icons/WhiteHeart.svg?react'
import Clock from '../assets/icons/Clock.svg?react'
import Calendar from '../assets/icons/Calendar.svg?react'
import { useEventLike } from '../hooks/useEventLike'

function DashCard({ image, date, time, artist, venue, onClick, variant = 'event', eventId }) {
  const { liked, toggleLike, isAuthenticated } = useEventLike(eventId)
  const navigate = useNavigate()

  function handleLike(e) {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    toggleLike(e)
  }

  return (
    <div
      onClick={onClick}
      className="relative shrink-0 w-44 rounded-2xl overflow-hidden cursor-pointer group flex flex-col"
      style={{
        border: '1.5px solid transparent',
        backgroundImage: 'linear-gradient(#00002C, #00002C), linear-gradient(to bottom, #000013, #FF3831)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}
    >
      <div
        className="absolute bottom-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-200 z-10"
        style={{ background: 'radial-gradient(ellipse at bottom right, #4133FF, transparent)' }}
      />

      {/*tp header imagfe */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={artist}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />

        {/*hearts */}
        {variant === 'event' && (
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 text-lg z-20"
          >
            {liked ? <RedHeart className="w-5 h-5" /> : <WhiteHeart className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/*bttom section: Info section */}
      <div className="flex flex-col gap-1 px-3 py-3">
        {variant === 'event' && (
          <>
            <div className="flex items-center gap-1 text-lavendar text-xs">
              <Calendar className="w-3 h-3" />
              <span className="font-display">{date}</span>
            </div>
            <div className="flex items-center gap-1 text-lavendar text-xs mb-1">
              <Clock className="w-3 h-3" />
              <span className="font-display">{time}</span>
            </div>
          </>
        )}
        <p className="text-white font-display text-sm">{artist}</p>
        {variant === 'event' && (
          <p className="text-lavendar/70 font-body text-xs">{venue}</p>
        )}
      </div>

    </div>
  )
}

export default DashCard