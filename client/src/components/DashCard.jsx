import { useState } from 'react'

function DashCard({ image, date, time, artist, venue }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="relative mx-8 mt-6 rounded-2xl overflow-hidden h-52 max-w-4xl flex-shrink-0 cursor-pointer group">

      {/* Image */}
      <img
        src={image}
        alt={artist}
        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* Heart */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-2 right-2 text-lg"
      >
        {liked ? '❤️' : '🤍'}
      </button>

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 py-3">
        <div className="flex items-center gap-1 text-gray-300 text-xs mb-1">
          <span>📅</span>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-300 text-xs mb-2">
          <span>🕐</span>
          <span>{time}</span>
        </div>
        <p className="text-white font-bold text-sm">{artist}</p>
        <p className="text-gray-400 text-xs">{venue}</p>
      </div>

    </div>
  )
}

export default DashCard