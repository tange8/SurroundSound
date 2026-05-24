// src/context/LocationContext.jsx
import { createContext, useContext, useState } from 'react'

const LocationContext = createContext(null)

const DEFAULT_LOCATION = { city: 'Los Angeles', stateCode: 'CA', label: 'Los Angeles, CA' }

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('surround_location')
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION
    } catch {
      return DEFAULT_LOCATION
    }
  })

  function updateLocation(newLocation) {
    setLocation(newLocation)
    localStorage.setItem('surround_location', JSON.stringify(newLocation))
  }

  function resetLocation() {
    setLocation(DEFAULT_LOCATION)
    localStorage.removeItem('surround_location')
  }

  return (
    <LocationContext.Provider value={{ location, updateLocation, resetLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) throw new Error('useLocation must be used inside <LocationProvider>')
  return context
}
