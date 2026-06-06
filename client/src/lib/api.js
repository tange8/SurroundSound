// src/lib/api.js
//any  calls to the Express server go through here
import { supabase } from "./supabase";

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
export async function fetchEvents({ city, stateCode, keyword, size = 20, venueId, attractionId } = {}) {
  return apiFetch('/api/events', { city, stateCode, keyword, size, venueId, attractionId })
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

//fetch search suggestions for events based on user input and location
export async function fetchSearch({ keyword, size = 5 }) {
  return apiFetch('/api/search', { keyword, size })
}


export async function saveEvent(eventId, userId) {
  const { data, error } = await supabase
    .from("event_saves")
    .insert({
      event_id: eventId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function unsaveEvent(eventId, userId) {
  const { error } = await supabase
    .from("event_saves")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function isEventSaved(eventId, userId) {
  const { data, error } = await supabase
    .from("event_saves")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function fetchArtistBio({ name }) {
  return apiFetch('/api/artist-bio', { name })
}