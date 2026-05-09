# SurroundSound

Team members: Emily Tang and Bryant Dang

## Note for Graders
Please set up the .env files in Supabase with the url/key listed below

---

### 1. Cloning Repo
git clone https://github.com/tange8/SurroundSound.git
cd SurroundSound

### 2. Client Set Up
cd client
npm install

.env credentials:

VITE_SUPABASE_URL= 'https://evsdtbjjsphkxyphvkam.supabase.co'
VITE_SUPABASE_ANON_KEY='yeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2R0Ympqc3Boa3h5cGh2a2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzODUwMTAsImV4cCI6MjA5MTk2MTAxMH0.XYh4lwPiBFgr3Cwe0PYvCQ9TOM_q-MLQOawuQO7Eywg'

### 3. Server Set Up
cd server
npm install

.env credentials:

SUPABASE_URL= 'https://evsdtbjjsphkxyphvkam.supabase.co'
SUPABASE_SERVICE_ROLE_KEY= 'yeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2R0Ympqc3Boa3h5cGh2a2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzODUwMTAsImV4cCI6MjA5MTk2MTAxMH0.XYh4lwPiBFgr3Cwe0PYvCQ9TOM_q-MLQOawuQO7Eywg'
PORT=3001

### 4. Running the program
Run the app
npm run dev

Open http://localhost:5173 in your browser.

---

##  Pages And Notes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Featured event, Trending Events, Venues Near You, and Favorite Artists sections |
| `/explore` | Explore | Search for artists, venues, and events |
| `/forum` | Forum | Community feed where fans post questions and share content |
| `/create` | Create Post | Form to create a new forum post tied to an event |
| `/event/:id` | Event Page | Individual event details including date, venue, and logistics |
| `/artist/:id` | Artist Page | Artist profile with upcoming events |
| `/venue/:id` | Venue Page | Venue details including policies, parking, and upcoming shows |
| `/profile` | Profile | Logged-in user's profile and saved events | 
| `/login` | Log In | User login screen |
| `/signup` | Sign Up | New user registration screen | 


NOTES: We hardcoded events, venues, and artists. You can navigate from the homepage and all our test routes are routed on there. Otherwise, please use id = 1 for any event, artist, or venue routes. And for auth pages, please click on the top right button that says Login/Signup.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase (auth + database)
