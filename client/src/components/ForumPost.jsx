import { useState } from 'react'
import WhiteHeart from '../assets/icons/WhiteHeart.svg?react'
import RedHeart from '../assets/icons/RedHeart.svg?react'

function ForumPost({ avatar, username, timestamp, event, title, body, image }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="flex flex-col gap-3 py-6 border-b border-red-orange/40">

      {/* Header — avatar, username, timestamp, event */}
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white font-body text-sm font-semibold">{username} · {timestamp}</span>
          <span className="text-lavendar/70 font-body text-xs">{event}</span>
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
        <p className="text-white/80 font-body text-sm leading-relaxed">{body}</p>
        <button
          onClick={() => setLiked(!liked)}
          className="shrink-0"
        >
          {liked ? <RedHeart className="w-5 h-5" /> : <WhiteHeart className="w-5 h-5" />}
        </button>
      </div>

    </div>
  )
}

export default ForumPost