import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const TM_KEY = process.env.TICKETMASTER_API_KEY;
const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const FS_KEY = process.env.FOURSQUARE_API_KEY;
const FS_BASE = "https://api.foursquare.com/v3";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SurroundSound server is running 🎵" });
});

async function tmFetch(endpoint, params = {}) {
  const url = new URL(`${TM_BASE}${endpoint}`);
  url.searchParams.set("apikey", TM_KEY);
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "") url.searchParams.set(key, val);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Ticketmaster error: ${res.status}`);
  return res.json();
}

function shapeEvent(e) {
  const venue = e._embedded?.venues?.[0];
  const artist = e._embedded?.attractions?.[0];
  const image =
      e.images?.find((i) => i.ratio === "16_9" && i.width > 1000)?.url ||
      e.images?.[0]?.url ||
      null;

  return {
    tm_event: {
      ticketmaster_id: e.id,
      title: e.name,
      event_date: e.dates?.start?.localDate || null,
      event_time: e.dates?.start?.localTime || null,
      image_url: image,
      buy_tickets_url: e.url || null,
      description: e.info || e.pleaseNote || null,
    },
    tm_artist: artist
        ? {
          ticketmaster_id: artist.id,
          name: artist.name,
          image_url: artist.images?.[0]?.url || null,
          genre: artist.classifications?.[0]?.genre?.name || null,
        }
        : null,
    tm_venue: venue
        ? {
          ticketmaster_id: venue.id,
          name: venue.name,
          address: venue.address?.line1 || null,
          city: venue.city?.name || null,
          state: venue.state?.stateCode || null,
          zip: venue.postalCode || null,
          latitude: venue.location?.latitude ? parseFloat(venue.location.latitude) : null,
          longitude: venue.location?.longitude ? parseFloat(venue.location.longitude) : null,
          image_url: venue.images?.[1]?.url || venue.images?.[0]?.url || null,
          general_info: venue.generalInfo?.generalRule || null,
          child_rule: venue.generalInfo?.childRule || null,
          parking_detail: venue.parkingDetail || null,
          box_office_phone: venue.boxOfficeInfo?.phoneNumberDetail || null,
          box_office_hours: venue.boxOfficeInfo?.openHoursDetail || null,
          box_office_payment: venue.boxOfficeInfo?.acceptedPaymentDetail || null,
        }
        : null,
  };
}

// GET /api/events — now supports page and radius
app.get("/api/events", async (req, res) => {
  try {
    const { city, stateCode, keyword, size = 20, venueId, attractionId, radius = 25, page = 0 } = req.query

    const data = await tmFetch("/events.json", {
      city,
      stateCode,
      keyword,
      size,
      attractionId,
      venueId,
      radius,
      page,
      classificationName: "music",
      sort: "date,asc",
    });

    const events = data._embedded?.events || [];
    const shaped = events.map(shapeEvent);

    res.json({
      events: shaped,
      total: data.page?.totalElements || 0,
      totalPages: data.page?.totalPages || 1,
      currentPage: data.page?.number || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const data = await tmFetch(`/events/${req.params.id}.json`);
    res.json(shapeEvent(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/artists/:id", async (req, res) => {
  try {
    const data = await tmFetch(`/attractions/${req.params.id}.json`);
    res.json({
      ticketmaster_id: data.id,
      name: data.name,
      image_url: data.images?.[0]?.url || null,
      genre: data.classifications?.[0]?.genre?.name || null,
      website_url: data.externalLinks?.homepage?.[0]?.url || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/venues/:id", async (req, res) => {
  try {
    const data = await tmFetch(`/venues/${req.params.id}.json`)
    res.json({
      ticketmaster_id: data.id,
      name: data.name,
      address: data.address?.line1 || null,
      city: data.city?.name || null,
      state: data.state?.stateCode || null,
      zip: data.postalCode || null,
      latitude: data.location?.latitude ? parseFloat(data.location.latitude) : null,
      longitude: data.location?.longitude ? parseFloat(data.location.longitude) : null,
      image_url: data.images?.[1]?.url || data.images?.[0]?.url || null,
      website_url: data.url || null,
      general_info: data.generalInfo?.generalRule || null,
      child_rule: data.generalInfo?.childRule || null,
      parking_detail: data.parkingDetail || null,
      box_office_phone: data.boxOfficeInfo?.phoneNumberDetail || null,
      box_office_hours: data.boxOfficeInfo?.openHoursDetail || null,
      box_office_payment: data.boxOfficeInfo?.acceptedPaymentDetail || null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/search", async (req, res) => {
  try {
    const { keyword, size = 5 } = req.query
    const [eventsData, venuesData] = await Promise.all([
      tmFetch("/events.json", { keyword, size, classificationName: "music", sort: "date,asc" }),
      tmFetch("/venues.json", { keyword, size })
    ])
    const events = eventsData._embedded?.events?.map(shapeEvent) || []
    const venues = venuesData._embedded?.venues?.map(v => ({
      ticketmaster_id: v.id,
      name: v.name,
      city: v.city?.name || null,
      state: v.state?.stateCode || null,
      image_url: v.images?.[1]?.url || v.images?.[0]?.url || null,
    })) || []
    res.json({ events, venues })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/artist-bio", async (req, res) => {
  try {
    const { name } = req.query
    if (!name) return res.json({ bio: null })
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(name)}&api_key=${process.env.LASTFM_API_KEY}&format=json`
    const response = await fetch(url)
    const data = await response.json()
    const bio = data.artist?.bio?.summary
        ?.replace(/<a[^>]*>.*?<\/a>/gi, '')
        ?.replace(/\s+/g, ' ')
        ?.trim() || null
    res.json({ bio })
  } catch (err) {
    res.json({ bio: null })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});