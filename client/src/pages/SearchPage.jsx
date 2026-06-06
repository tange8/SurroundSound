import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchEvents } from '../lib/api'
import { useLocation as useUserLocation } from '../context/LocationContext'
import DashCard from '../components/DashCard'

const PAGE_SIZE = 20

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const date = new Date()
  date.setHours(+h, +m)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function PageButton({ label, onClick, active, disabled }) {
  return (
      <button
          onClick={onClick}
          disabled={disabled}
          className="w-9 h-9 rounded-full font-body text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: active ? '#4133FF' : 'transparent',
            color: active ? '#fff' : '#8890cc',
            border: active ? 'none' : '1px solid #4133FF',
          }}
          onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = 'rgba(65,51,255,0.2)' }}
          onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'transparent' }}
      >
        {label}
      </button>
  )
}

export default function ExplorePage() {
  const navigate = useNavigate()
  const { location } = useUserLocation()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    loadEvents()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, keyword, location])

  async function loadEvents() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchEvents({
        city: location.city,
        stateCode: location.stateCode,
        keyword: keyword || undefined,
        size: PAGE_SIZE,
        page,
      })
      setEvents(data.events || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    setPage(0)
    setKeyword(inputValue)
  }

  function getPageNumbers() {
    const delta = 2
    const range = []
    const left = Math.max(0, page - delta)
    const right = Math.min(totalPages - 1, page + delta)
    for (let i = left; i <= right; i++) range.push(i)
    if (range[0] > 0) {
      if (range[0] > 1) range.unshift('...')
      range.unshift(0)
    }
    if (range[range.length - 1] < totalPages - 1) {
      if (range[range.length - 1] < totalPages - 2) range.push('...')
      range.push(totalPages - 1)
    }
    return range
  }

  return (
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl" style={{ color: '#CCD0FF' }}>Explore</h1>
            {!loading && total > 0 && (
                <p className="font-body text-sm mt-1" style={{ color: '#6670aa' }}>
                  {total.toLocaleString()} events near {location.city}
                </p>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Search artists, events…"
                className="font-body text-sm rounded-full px-4 py-2 outline-none w-56"
                style={{ background: '#00002C', border: '1px solid #4133FF', color: '#CCD0FF' }}
                onFocus={e => e.target.style.borderColor = '#A100FF'}
                onBlur={e => e.target.style.borderColor = '#4133FF'}
            />
            <button
                type="submit"
                className="font-body text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:brightness-110"
                style={{ background: '#FF3831' }}
            >
              Search
            </button>
            {keyword && (
                <button
                    type="button"
                    onClick={() => { setKeyword(''); setInputValue(''); setPage(0) }}
                    className="font-body text-sm px-4 py-2 rounded-full transition-all"
                    style={{ background: '#000013', border: '1px solid #4133FF', color: '#8890cc' }}
                >
                  Clear
                </button>
            )}
          </form>
        </div>

        {/* Grid */}
        {loading ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {[...Array(PAGE_SIZE)].map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl" style={{ background: '#00002C' }} />
              ))}
            </div>
        ) : error ? (
            <p className="font-body text-sm" style={{ color: '#FF3831' }}>{error}</p>
        ) : events.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-lg" style={{ color: '#6670aa' }}>No events found.</p>
            </div>
        ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {events.map(({ tm_event, tm_artist, tm_venue }) => (
                  <DashCard
                      key={tm_event.ticketmaster_id}
                      image={tm_event.image_url}
                      date={formatDate(tm_event.event_date)}
                      time={formatTime(tm_event.event_time)}
                      artist={tm_artist?.name || tm_event.title}
                      venue={tm_venue ? `at ${tm_venue.name}` : ''}
                      eventId={tm_event.ticketmaster_id}
                      artistId={tm_artist?.ticketmaster_id}
                      onClick={() => navigate(`/event/${tm_event.ticketmaster_id}`)}
                  />
              ))}
            </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <PageButton
                  label="←"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 0}
              />

              {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                      <span key={`dots-${i}`} className="font-body text-sm px-1" style={{ color: '#4a5080' }}>…</span>
                  ) : (
                      <PageButton
                          key={p}
                          label={p + 1}
                          onClick={() => setPage(p)}
                          active={p === page}
                      />
                  )
              )}

              <PageButton
                  label="→"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
              />
            </div>
        )}

      </div>
  )
}