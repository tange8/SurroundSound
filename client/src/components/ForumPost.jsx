import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import WhiteHeart from '../assets/icons/WhiteHeart.svg?react'
import RedHeart from '../assets/icons/RedHeart.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const PREVIEW_COUNT = 0
const MAX_DEPTH = 3
const BUCKET = 'comment-images'

function buildTree(comments, parentId = null) {
  return comments
    .filter(c => (c.parent_id ?? null) === parentId)
    .map(c => ({ ...c, children: buildTree(comments, c.id) }))
}

function formatTimestamp(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Shared image upload helper
async function uploadCommentImage(file, userId) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// Reusable reply input with optional image attachment
function ReplyInput({ profile, placeholder = 'Write a reply...', onSubmit, onCancel, submitting }) {
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const { user } = useAuth()

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit() {
    if (!text.trim() && !imageFile) return
    setUploading(true)
    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadCommentImage(imageFile, user.id)
      }
      await onSubmit(text.trim(), imageUrl)
      setText('')
      setImageFile(null)
      setImagePreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      console.error('Reply submit error:', err)
    } finally {
      setUploading(false)
    }
  }

  const busy = submitting || uploading
  const canPost = (text.trim() || imageFile) && !busy

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      {/* Image preview */}
      {imagePreview && (
        <div className="relative w-fit">
          <img src={imagePreview} alt="preview" className="max-h-28 rounded-lg object-cover" />
          <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black/70 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-orange transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <input
          autoFocus
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') { onCancel?.(); }
          }}
          placeholder={placeholder}
          className="flex-1 bg-white/10 text-white placeholder-white/30 font-body text-sm rounded-full px-4 py-1.5 outline-none focus:ring-1 focus:ring-red-orange/50"
        />

        {/* Image attach button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-white/30 hover:text-lavendar transition-colors shrink-0"
          title="Attach image"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          onClick={handleSubmit}
          disabled={!canPost}
          className="text-red-orange font-body text-sm font-semibold disabled:opacity-40 shrink-0"
        >
          {busy ? '...' : 'Post'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-white/30 font-body text-sm shrink-0"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

function Comment({ comment, depth, onReply, onDelete }) {
  const [showReply, setShowReply] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const children = comment.children || []
  const visibleChildren = expanded ? children : children.slice(0, PREVIEW_COUNT)
  const hiddenCount = children.length - PREVIEW_COUNT

  function handleReplyClick() {
    if (!user) { navigate('/login'); return }
    setShowReply(true)
  }

  async function handleSubmitReply(text, imageUrl) {
    await onReply(text, comment.id, imageUrl)
    setShowReply(false)
    setExpanded(true)
  }

  async function handleDelete() {
    await supabase.from('forum_comments').delete().eq('id', comment.id)
    onDelete(comment.id)
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
        {comment.profiles?.avatar_url ? (
          <img src={comment.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          <ProfileIcon className="w-3 h-3 text-white" />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-white/60 font-body text-xs">
          @{comment.profiles?.username || 'unknown'} · {formatTimestamp(comment.created_at)}
        </span>
        {comment.body && <p className="text-white/80 font-body text-sm">{comment.body}</p>}

        {/* Comment image */}
        {comment.image_url && (
          <img
            src={comment.image_url}
            alt="comment attachment"
            className="mt-1.5 max-h-48 max-w-xs rounded-lg object-cover"
          />
        )}

        {/* Reply and delete buttons */}
        <div className="flex items-center gap-3 mt-1">
          {depth < MAX_DEPTH && (
            <button
              onClick={handleReplyClick}
              className="text-white/30 font-body text-xs hover:text-lavendar transition-colors"
            >
              Reply
            </button>
          )}
          {user?.id === comment.user_id && (
            <button
              onClick={handleDelete}
              className="text-white/20 font-body text-xs hover:text-red-orange transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* Inline reply input */}
        {showReply && (
          <div className="flex gap-2 items-start mt-2">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <ProfileIcon className="w-2.5 h-2.5 text-white" />
              )}
            </div>
            <ReplyInput
              profile={profile}
              placeholder="Write a reply..."
              onSubmit={handleSubmitReply}
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}

        {/* Children */}
        {children.length > 0 && (
          <div className="mt-2 pl-3 border-l border-white/10 flex flex-col gap-3">
            {visibleChildren.map(child => (
              <Comment
                key={child.id}
                comment={child}
                depth={depth + 1}
                onReply={onReply}
                onDelete={onDelete}
              />
            ))}
            {!expanded && hiddenCount > 0 && (
              <button
                onClick={() => setExpanded(true)}
                className="text-lavendar/60 font-body text-xs hover:text-white transition-colors text-left"
              >
                See {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
            {expanded && children.length > PREVIEW_COUNT && (
              <button
                onClick={() => setExpanded(false)}
                className="text-lavendar/60 font-body text-xs hover:text-white transition-colors text-left"
              >
                Collapse replies
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ForumPost({ id, avatar, username, timestamp, event, title, body, image, liked, likeCount, onLike, isAuthenticated }) {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [allComments, setAllComments] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('forum_comments')
      .select('id, body, image_url, created_at, parent_id, user_id, profiles(username, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
      .then(({ data }) => setAllComments(data || []))
  }, [id])

  async function handleReply(text, parentId = null, imageUrl = null) {
    if (!user || submitting) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('forum_comments')
      .insert({ post_id: id, user_id: user.id, body: text || null, parent_id: parentId, image_url: imageUrl })
      .select('id, body, image_url, created_at, parent_id, user_id, profiles(username, avatar_url)')
      .single()

    if (!error && data) {
      setAllComments(prev => [...prev, data])
      if (!parentId) setExpanded(true)
    }
    setSubmitting(false)
  }

  function handleDelete(commentId) {
    setAllComments(prev => {
      const toRemove = new Set()
      function collect(id) {
        toRemove.add(id)
        prev.filter(c => c.parent_id === id).forEach(c => collect(c.id))
      }
      collect(commentId)
      return prev.filter(c => !toRemove.has(c.id))
    })
  }

  function handleLike() {
    if (!isAuthenticated) { navigate('/login'); return }
    onLike()
  }

  function handleReplyClick() {
    if (!isAuthenticated) { navigate('/login'); return }
    setShowReplyInput(true)
  }

  const tree = buildTree(allComments)
  const visibleTree = expanded ? tree : tree.slice(0, PREVIEW_COUNT)
  const hiddenCount = tree.length - PREVIEW_COUNT

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
        <img src={image} alt={title} className="rounded-xl max-w-sm w-full object-cover" />
      )}

      {/* Body + heart */}
      <div className="flex items-end justify-between gap-4">
        {body && <p className="text-white/80 font-body text-sm leading-relaxed">{body}</p>}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {likeCount > 0 && <span className="text-white/40 font-body text-xs">{likeCount}</span>}
          <button onClick={handleLike}>
            {liked ? <RedHeart className="w-5 h-5" /> : <WhiteHeart className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Comment tree */}
      {tree.length > 0 && (
        <div className="flex flex-col gap-3 pl-3 border-l border-white/10 mt-1">
          {visibleTree.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              depth={0}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))}
          {!expanded && hiddenCount > 0 && (
            <button
              onClick={() => setExpanded(true)}
              className="text-lavendar/60 font-body text-xs hover:text-white transition-colors text-left"
            >
              See {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'}
            </button>
          )}
          {expanded && tree.length > PREVIEW_COUNT && (
            <button
              onClick={() => setExpanded(false)}
              className="text-lavendar/60 font-body text-xs hover:text-white transition-colors text-left"
            >
              Collapse replies
            </button>
          )}
        </div>
      )}

      {/* Top-level reply input */}
      {showReplyInput ? (
        <div className="flex gap-2 items-start mt-1 pl-3">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <ProfileIcon className="w-3 h-3 text-white" />
            )}
          </div>
          <ReplyInput
            profile={profile}
            placeholder="Write a reply..."
            onSubmit={(text, imageUrl) => handleReply(text, null, imageUrl)}
            onCancel={() => setShowReplyInput(false)}
            submitting={submitting}
          />
        </div>
      ) : (
        <button
          onClick={handleReplyClick}
          className="text-lavendar/40 font-body text-sm hover:text-lavendar transition-colors text-left mt-1"
        >
          Reply...
        </button>
      )}

    </div>
  )
}

export default ForumPost