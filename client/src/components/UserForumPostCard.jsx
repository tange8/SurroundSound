import { useNavigate } from 'react-router-dom'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function UserForumPostCard({ post, onDelete }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/forum/${post.id}`)}
      className="relative group flex gap-3 rounded-xl p-4 cursor-pointer transition-colors"
      style={{ background: '#000013', border: '1px solid #4133FF' }}
      onMouseEnter={e => e.currentTarget.style.background = '#0a0050'}
      onMouseLeave={e => e.currentTarget.style.background = '#000013'}
    >
      {/* Event tag */}
      {post.event_title && (
        <div className="absolute top-3 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
        </div>
      )}

      {/* Thumbnail */}
      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 text-xl font-bold font-display"
          style={{ background: '#4133FF', color: '#CCD0FF' }}
        >
          {post.title?.[0]?.toUpperCase() || '?'}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0 gap-0.5 flex-1">
        <p className="font-display font-semibold text-sm truncate" style={{ color: '#CCD0FF' }}>
          {post.title}
        </p>
        {post.event_title && (
          <p className="font-body text-xs truncate" style={{ color: '#8890cc' }}>
            {post.event_title}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          {post.body && (
            <p className="font-body text-xs truncate flex-1" style={{ color: '#6670aa' }}>
              {post.body}
            </p>
          )}
          <span className="font-body text-xs flex-shrink-0" style={{ color: '#4a5080' }}>
            {timeAgo(post.created_at)}
          </span>
        </div>
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(post.id) }}
          className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-lg leading-none"
          style={{ color: '#6670aa' }}
          onMouseEnter={e => e.currentTarget.style.color = '#FF3831'}
          onMouseLeave={e => e.currentTarget.style.color = '#6670aa'}
        >×</button>
      )}
    </div>
  )
}

export default UserForumPostCard
