import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ForumPage from './pages/ForumPage'
import ProfilePage from './pages/ProfilePage'
import TopNav from './components/TopBar'
import EventPage from './pages/EventPage'
import CreatePage from './pages/CreatePage'

function App() {
  return (
    <div className="min-h-screen text-white">

      {/* Fixed gradient background */}
      <div className="fixed inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at top right, rgba(180, 20, 20, 0.6) 0%, transparent 55%), #000013'
      }} />

      {/* Top nav spans full width */}
      <TopNav />

      {/* Sidebar + content sit below topnav */}
      <div className="flex pt-16">
        <NavBar />
        <main className="ml-52 flex-1 min-w-0 p-6">
          <Routes>
            <Route path="/"               element={<HomePage />} />
            <Route path="/explore"        element={<SearchPage />} />
            <Route path="/forum"          element={<ForumPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
            <Route path="/event/:eventId" element={<EventPage />} />
            <Route path="/create" element={<CreatePage />} />
          </Routes>
        </main>
      </div>

    </div>
  )
}

export default App