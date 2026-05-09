import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ForumPage from './pages/ForumPage'
import ProfilePage from './pages/ProfilePage'
import TopNav from './components/TopBar'
import EventPage from './pages/EventPage'
import CreatePage from './pages/CreatePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ArtistPage from "./pages/ArtistPage.jsx";
import VenuePage from "./pages/VenuePage.jsx";

function App() {
  //we use uselocation() to hide navbars on the login and signup pages
  const location = useLocation()
  const hideNav = ['/login', '/signup'].includes(location.pathname)
  return (
    <div className="min-h-screen text-white">

      {/*a gradient will be seen in all pages */}
      <div className="fixed inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at top right, rgba(180, 20, 20, 0.6) 0%, transparent 55%), #000013'
      }} />

      {/*toop nav spans full width and will be hidden on login/signup pages */}
      {!hideNav && <TopNav />}

      {/* Sidebar + content sit below topnav */}
      <div className={`flex ${!hideNav ? 'pt-16' : ''}`}>
        {!hideNav && <NavBar />}
         <main className={!hideNav ? 'ml-52 flex-1 min-w-0 p-6' : 'flex-1'}>
          <Routes>
            <Route path="/"               element={<HomePage />} />
            <Route path="/explore"        element={<SearchPage />} />
            <Route path="/forum"          element={<ForumPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
            <Route path="/event/:eventId" element={<EventPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
             <Route path="/artist/:artistId" element={<ArtistPage />} />
             <Route path="/venue/:venueId" element={<VenuePage />} />
          </Routes>
        </main>
      </div>

    </div>
  )
}

export default App