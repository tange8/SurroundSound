// src/components/LocationPicker.jsx
import { useState, useRef, useEffect } from 'react'
import { useLocation as useUserLocation } from '../context/LocationContext'
import LocationIcon from '../assets/icons/LocationIcon.svg?react'

//popular US cities for the quick-pick list
const POPULAR_CITIES = [
  { city: 'Los Angeles',   stateCode: 'CA', label: 'Los Angeles, CA' },
  { city: 'New York',      stateCode: 'NY', label: 'New York, NY' },
  { city: 'Chicago',       stateCode: 'IL', label: 'Chicago, IL' },
  { city: 'Houston',       stateCode: 'TX', label: 'Houston, TX' },
  { city: 'Phoenix',       stateCode: 'AZ', label: 'Phoenix, AZ' },
  { city: 'Philadelphia',  stateCode: 'PA', label: 'Philadelphia, PA' },
  { city: 'San Antonio',   stateCode: 'TX', label: 'San Antonio, TX' },
  { city: 'San Diego',     stateCode: 'CA', label: 'San Diego, CA' },
  { city: 'Dallas',        stateCode: 'TX', label: 'Dallas, TX' },
  { city: 'San Jose',      stateCode: 'CA', label: 'San Jose, CA' },
  { city: 'Austin',        stateCode: 'TX', label: 'Austin, TX' },
  { city: 'Seattle',       stateCode: 'WA', label: 'Seattle, WA' },
  { city: 'Denver',        stateCode: 'CO', label: 'Denver, CO' },
  { city: 'Nashville',     stateCode: 'TN', label: 'Nashville, TN' },
  { city: 'Miami',         stateCode: 'FL', label: 'Miami, FL' },
  { city: 'Atlanta',       stateCode: 'GA', label: 'Atlanta, GA' },
  { city: 'Las Vegas',     stateCode: 'NV', label: 'Las Vegas, NV' },
  { city: 'Portland',      stateCode: 'OR', label: 'Portland, OR' },
  { city: 'San Francisco', stateCode: 'CA', label: 'San Francisco, CA' },
  { city: 'Boston',        stateCode: 'MA', label: 'Boston, MA' },
]

export default function LocationPicker() {
 const { location, updateLocation } = useUserLocation()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  //closes when clicjking outside of the dropdown
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  //focus input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const filtered = search.trim()
    ? POPULAR_CITIES.filter(c =>
        c.label.toLowerCase().includes(search.toLowerCase())
      )
    : POPULAR_CITIES

  function handleSelect(city) {
    updateLocation(city)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 font-display font-semibold text-sm text-white bg-red-orange hover:bg-red-600 px-3 py-2 rounded-full transition-colors"
      >
        <LocationIcon className="w-4 h-4 shrink-0" />
        <span className="hidden lg:inline max-w-[120px] truncate">{location.label}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-64 rounded-2xl overflow-hidden z-50 shadow-2xl"
          style={{
            background: '#00002C',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {/* Search input */}
          <div className="p-3 border-b border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search city..."
              className="w-full bg-white/10 text-white placeholder-white/40 font-body text-sm rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-red-orange/50"
            />
          </div>

          {/* City list */}
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-white/40 text-sm font-body text-center">
                No cities found
              </li>
            ) : (
              filtered.map(city => (
                <li key={city.label}>
                  <button
                    onClick={() => handleSelect(city)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors flex items-center justify-between
                      ${location.label === city.label
                        ? 'text-red-orange bg-red-orange/10'
                        : 'text-white hover:bg-white/10'
                      }`}
                  >
                    {city.label}
                    {location.label === city.label && (
                      <span className="text-red-orange text-xs">✓</span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
