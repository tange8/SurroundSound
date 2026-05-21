import { Routes, Route, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import NavBar from './components/NavBar'
import TopNav from './components/TopBar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ForumPage from './pages/ForumPage'
import ProfilePage from './pages/ProfilePage'
import EventPage from './pages/EventPage'
import CreatePage from './pages/CreatePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ArtistPage from './pages/ArtistPage.jsx'
import VenuePage from './pages/VenuePage.jsx'

function App() {
  const location = useLocation()
  const hideNav = ['/login', '/signup'].includes(location.pathname)

  return (
    <div className="min-h-screen text-white">

      {/* Background gradient across all pages */}
      <div className="fixed inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at top right, rgba(180, 20, 20, 0.6) 0%, transparent 55%), #000013'
      }} />

      {!hideNav && <TopNav />}

      <div className={`flex ${!hideNav ? 'pt-16' : ''}`}>
        {!hideNav && <NavBar />}
        <main className={!hideNav ? 'ml-52 flex-1 min-w-0 p-6' : 'flex-1'}>
          <Routes>
            {/* Public routes */}
            <Route path="/"                 element={<HomePage />} />
            <Route path="/explore"          element={<SearchPage />} />
            <Route path="/forum"            element={<ForumPage />} />
            <Route path="/event/:eventId"   element={<EventPage />} />
            <Route path="/artist/:artistId" element={<ArtistPage />} />
            <Route path="/venue/:venueId"   element={<VenuePage />} />
            <Route path="/login"            element={<LoginPage />} />
            <Route path="/signup"           element={<SignUpPage />} />

            {/* Protected routes — must be logged in */}
            <Route path="/create" element={
              <ProtectedRoute><CreatePage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>

    </div>
  )
}

export default App