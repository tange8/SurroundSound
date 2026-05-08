import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/icons/Logo.svg?react'
import LocationIcon from '../assets/icons/LocationIcon.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'

function TopBar() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/explore?q=${search}`)
    }
  }
  //we will use const and call the api later on for location button lol

  //we will also use useState for the login/signup button to show the user info when logged in and change the button to profile icon?

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-darker-blue border-b border-white/10 flex items-center px-6 gap-4 z-10">
      
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
        <button className="flex items-center gap-2 font-display font-semibold text-sm text-white bg-red-orange hover:bg-white/20 px-3 py-2 rounded-full transition-colors">
            <LocationIcon className="w-4 h-4 shrink-0" /> 
            Location
        </button>
        {/* THIS WILL BE LATER USED when we implement authentication??
                {user ? (
          <button className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/60 transition-colors">
            {user.avatar_url
              ? <img src={user.avatar_url} alt="profile" className="w-full h-full object-cover" />
              : <ProfileIcon className="w-5 h-5 text-white" />
            }
          </button>
        ) : ( */}

        <button className="flex items-center gap-2 font-display font-semibold text-sm text-white bg-red-orange hover:bg-red-600 px-4 py-2 rounded-full transition-colors">
          <ProfileIcon className="w-4 h-4 shrink-0" /> 
          <span className="hidden lg:inline">Sign Up / Log In</span>
          <span className="lg:hidden">Log In</span>
        </button>
      </div>

    </div>
  )
}

export default TopBar