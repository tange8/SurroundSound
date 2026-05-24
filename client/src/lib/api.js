// src/lib/api.js
//any  calls to the Express server go through here

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

async function apiFetch(path, params = {}) {
  const url = new URL(`${SERVER_URL}${path}`)
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== '') url.searchParams.set(key, val)
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Server error: ${res.status}`)
  return res.json()
}

//feetch music events near a city
export async function fetchEvents({ city = 'Los Angeles', stateCode = 'CA', keyword, size = 20 } = {}) {
  return apiFetch('/api/events', { city, stateCode, keyword, size })
}

//fetch a single event by Ticketmaster ID
export async function fetchEvent(id) {
  return apiFetch(`/api/events/${id}`)
}

//fetch a single artist by Ticketmaster attraction ID
export async function fetchArtist(id) {
  return apiFetch(`/api/artists/${id}`)
}

//fetch a single venue by Ticketmaster venue ID
export async function fetchVenue(id) {
  return apiFetch(`/api/venues/${id}`)
}


//detch a venue photo from Foursquare by venue name + city
export async function fetchVenuePhoto({ name, city, state }) {
  return apiFetch('/api/venue-photo', { name, city, state })
}