import { Link, useLocation } from 'react-router-dom'
import HomeIcon from '../assets/icons/Home.svg?react'
import ExploreIcon from '../assets/icons/Globe.svg?react'
import ForumIcon from '../assets/icons/Chat_Circle.svg?react'
import PostIcon from '../assets/icons/Chat_Circle_Add.svg?react'


const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Explore',     path: '/explore', icon: <ExploreIcon /> },
  { label: 'Forum',       path: '/forum',   icon: <ForumIcon /> },
  { label: 'Create Post', path: '/create',  icon: <PostIcon /> },
]

function NavBar() {
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 h-screen w-52 bg-[#0d0d1a] flex flex-col gap-2 px-4 py-6 pt-20">
      

      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors
            ${location.pathname === item.path
              ? 'text-white font-semibold'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default NavBar