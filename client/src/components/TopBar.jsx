import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/icons/Logo.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'
import { useAuth } from '../context/AuthContext'
import { useLocation as useUserLocation } from '../context/LocationContext'
import LocationPicker from './LocationPicker'
import { fetchSearch } from '../lib/api'

function TopBar() {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [venueSuggestions, setVenueSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, profile, signOut } = useAuth()
  const { location } = useUserLocation()
  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  //close on click outside of the search input or suggestions dropdown
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  //debounced search for events and venues based on user input, updates suggestions dropdown in the TopBar
  useEffect(() => {
    if (!search.trim() || search.length < 2) {
      setSuggestions([])
      setVenueSuggestions([])
      setShowSuggestions(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const data = await fetchSearch({ keyword: search, size: 5 })
        setSuggestions(data.events || [])
        setVenueSuggestions(data.venues || [])
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
        setVenueSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [search])

  function handleSelect(event) {
    setSearch('')
    setShowSuggestions(false)
    navigate(`/event/${event.tm_event.ticketmaster_id}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && search.trim()) {
      setShowSuggestions(false)
      navigate(`/explore?q=${encodeURIComponent(search)}`)
    }
    if (e.key === 'Escape') setShowSuggestions(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-darker-blue border-b border-white/10 flex items-center px-6 gap-4 z-50">

      <div className="shrink-0">
        <Logo className="h-8 w-auto" />
      </div>

      {/* Search with autocomplete */}
      <div ref={searchRef} className="relative flex-1 min-w-0 max-w-xl mx-auto">
        <div className="p-[1.5px] rounded-full" style={{
          background: 'linear-gradient(to right, #4133FF, #A100FF, #FF3831)'
        }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => (suggestions.length > 0 || venueSuggestions.length > 0) && setShowSuggestions(true)}
            placeholder="Search for artists, venues, or upcoming events..."
            className="w-full bg-white text-black placeholder-gray-400 text-sm rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* drowdown with suggestions based on user inpout*/}
        {showSuggestions && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl z-50"
            style={{
              background: '#00002C',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {loadingSuggestions ? (
              <div className="px-4 py-3 text-white/40 text-sm font-body">Searching...</div>
            ) : suggestions.length === 0 && venueSuggestions.length === 0 ? (
              <div className="px-4 py-3 text-white/40 text-sm font-body">No results found</div>
            ) : (
              <>
                {/*events */}
                {suggestions.length > 0 && (
                  <>
                    <div className="px-4 py-1 pt-2 text-white/40 text-xs font-body">EVENTS</div>
                    <ul>
                      {suggestions.map(({ tm_event, tm_artist, tm_venue }, i) => (
                        <li key={tm_event.ticketmaster_id}>
                          <button
                            onClick={() => handleSelect({ tm_event })}
                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                          >
                            {tm_event.image_url && (
                              <img
                                src={tm_event.image_url}
                                alt={tm_event.title}
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-white text-sm font-display truncate">
                                {tm_artist?.name || tm_event.title}
                              </span>
                              <span className="text-white/40 text-xs font-body truncate">
                                {tm_venue?.name} · {tm_event.event_date}
                              </span>
                            </div>
                          </button>
                          {i < suggestions.length - 1 && (
                            <div className="h-px bg-white/10 mx-4" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Venues */}
                {venueSuggestions.length > 0 && (
                  <>
                    <div className="px-4 py-1 text-white/40 text-xs font-body border-t border-white/10">VENUES</div>
                    <ul>
                      {venueSuggestions.map((venue) => (
                        <li key={venue.ticketmaster_id}>
                          <button
                            onClick={() => {
                              setSearch('')
                              setShowSuggestions(false)
                              navigate(`/venue/${venue.ticketmaster_id}`)
                            }}
                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                          >
                            {/* replace the emoji placeholder with this */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/10">
                              {venue.image_url ? (
                                <img
                                  src={venue.image_url}
                                  alt={venue.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">📍</div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-white text-sm font-display truncate">{venue.name}</span>
                              <span className="text-white/40 text-xs font-body truncate">{venue.city}, {venue.state}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <LocationPicker />

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/60 transition-colors"
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="profile" className="w-full h-full object-cover" />
                : <ProfileIcon className="w-5 h-5 text-white" />
              }
            </button>
            <button
              onClick={handleSignOut}
              className="font-display font-semibold text-sm text-white/60 hover:text-white transition-colors"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 font-display font-semibold text-sm text-white bg-red-orange hover:bg-red-600 px-4 py-2 rounded-full transition-colors"
          >
            <ProfileIcon className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Sign Up / Log In</span>
            <span className="lg:hidden">Log In</span>
          </button>
        )}
      </div>

    </div>
  )
}

export default TopBar