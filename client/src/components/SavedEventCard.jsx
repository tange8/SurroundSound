import { useNavigate } from 'react-router-dom'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function SavedEventCard({ event, onUnsave }) {
  const navigate = useNavigate()

  return (
      <div
          onClick={() => navigate(`/event/${event.tm_event_id}`)}
          className="relative group flex gap-4 rounded-xl p-3 cursor-pointer transition-colors"
          style={{ background: '#000013', border: '1px solid #4133FF' }}
          onMouseEnter={e => e.currentTarget.style.background = '#0a0050'}
          onMouseLeave={e => e.currentTarget.style.background = '#000013'}
      >
        {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        ) : (
            <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
                 style={{ background: '#4133FF' }}>🎵</div>
        )}

        <div className="flex flex-col justify-center min-w-0 gap-0.5">
          <p className="font-display font-semibold text-sm truncate" style={{ color: '#CCD0FF' }}>
            {event.title || event.tm_event_id}
          </p>
          {(event.venue_name || event.city) && (
              <p className="font-body text-xs truncate" style={{ color: '#8890cc' }}>
                {[event.venue_name, event.city, event.state].filter(Boolean).join(', ')}
              </p>
          )}
          {event.event_date && (
              <p className="font-body text-xs" style={{ color: '#6670aa' }}>
                {formatDate(event.event_date)}
              </p>
          )}
        </div>

        <button
            onClick={e => { e.stopPropagation(); onUnsave(event.id) }}
            className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-lg leading-none"
            style={{ color: '#6670aa' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FF3831'}
            onMouseLeave={e => e.currentTarget.style.color = '#6670aa'}
        >×</button>
      </div>
  )
}

export default SavedEventCard