import { useNavigate } from 'react-router-dom'
import WhiteHeart from '../assets/icons/WhiteHeart.svg?react'
import RedHeart from '../assets/icons/RedHeart.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'

function ForumPost({ id, avatar, username, timestamp, event, title, body, image, liked, likeCount, onLike, isAuthenticated }) {
  const navigate = useNavigate()

  function handleLike() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onLike()
  }

  return (
    <div className="flex flex-col gap-3 py-6 border-b border-red-orange/40">

      {/* Header */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={username} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <ProfileIcon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-white font-body text-sm font-semibold">
            {username} · {timestamp}
          </span>
          {event && (
            <span className="text-lavendar/70 font-body text-xs">{event}</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-white font-display font-bold text-xl">{title}</h2>

      {/* Optional image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="rounded-xl max-w-sm w-full object-cover"
        />
      )}

      {/* Body + heart row */}
      <div className="flex items-end justify-between gap-4">
        {body && (
          <p className="text-white/80 font-body text-sm leading-relaxed">{body}</p>
        )}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {likeCount > 0 && (
            <span className="text-white/40 font-body text-xs">{likeCount}</span>
          )}
          <button onClick={handleLike}>
            {liked
              ? <RedHeart className="w-5 h-5" />
              : <WhiteHeart className="w-5 h-5" />
            }
          </button>
        </div>
      </div>

    </div>
  )
}

export default ForumPost