import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ForumPage from './pages/ForumPage'
import ProfilePage from './pages/ProfilePage'
import TopNav from './components/TopBar'
import EventPage from './pages/EventPage'

function App() {
  return (
    <div className="flex bg-darker-blue min-h-screen text-white">
      <NavBar />
        <div className="ml-52 flex-1 flex flex-col">
          <TopNav />
            <main className="ml-52 flex-1 p-6 pt-16">
              <Routes>
                <Route path="/"        element={<HomePage />} />
                <Route path="/explore" element={<SearchPage />} />
                <Route path="/forum"   element={<ForumPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/event/:eventId" element={<EventPage />} /> 
              </Routes>
            </main>
        </div>
    </div>
  )
}

export default App