import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/icons/Logo.svg?react'
import LocationIcon from '../assets/icons/LocationIcon.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'
import { useAuth } from '../context/AuthContext'
import LocationPicker from './LocationPicker'

function TopBar() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, profile, signOut } = useAuth()

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/explore?q=${search}`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-darker-blue border-b border-white/10 flex items-center px-6 gap-4 z-50">
      
      <div className="shrink-0">
        <Logo className="h-8 w-auto" />
      </div>

      <div className="p-[1.5px] rounded-full flex-1 min-w-0 max-w-xl mx-auto" style={{
        background: 'linear-gradient(to right, #4133FF, #A100FF, #FF3831)'
      }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search for your upcoming events..."
          className="w-full bg-white text-black placeholder-black-400 text-sm rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <LocationPicker />

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {/* Profile icon — navigates to profile page */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/60 transition-colors"
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="profile" className="w-full h-full object-cover" />
                : <ProfileIcon className="w-5 h-5 text-white" />
              }
            </button>
            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="font-display font-semibold text-sm text-white/60 hover:text-white transition-colors"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 font-display font-semibold text-sm text-white bg-red-orange hover:bg-red-600 px-4 py-2 rounded-full transition-colors"
          >
            <ProfileIcon className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Sign Up / Log In</span>
            <span className="lg:hidden">Log In</span>
          </button>
        )}
      </div>

    </div>
  )
}

export default TopBar