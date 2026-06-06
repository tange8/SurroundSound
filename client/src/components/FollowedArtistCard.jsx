import { useNavigate } from 'react-router-dom'

function FollowedArtistCard({ artist, onUnfollow }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/artist/${artist.tm_artist_id}`)}
      className="relative group flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer w-24"
    >
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
        style={{ border: '2px solid #4133FF' }}
      >
        {artist.artist_image ? (
          <img src={artist.artist_image} alt={artist.artist_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl"
            style={{ background: '#4133FF' }}>🎤</div>
        )}
      </div>

      {/* Name */}
      <p className="font-body text-xs text-center leading-tight line-clamp-2" style={{ color: '#CCD0FF' }}>
        {artist.artist_name}
      </p>

      {/* Unfollow on hover */}
      <button
        onClick={e => { e.stopPropagation(); onUnfollow(artist.id) }}
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        style={{ background: '#FF3831', color: '#fff' }}
        title="Unfollow"
      >×</button>
    </div>
  )
}

export default FollowedArtistCard
