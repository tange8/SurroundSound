import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WhiteHeart from '../assets/icons/WhiteHeart.svg?react'
import RedHeart from '../assets/icons/RedHeart.svg?react'
import ProfileIcon from '../assets/icons/ProfileIcon.svg?react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const PREVIEW_COUNT = 0
const MAX_DEPTH = 3

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

function Comment({ comment, depth, onReply, onDelete }) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
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

  async function handleSubmit() {
    if (!replyText.trim()) return
    await onReply(replyText.trim(), comment.id)
    setReplyText('')
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
        <p className="text-white/80 font-body text-sm">{comment.body}</p>

        {/* reply and delte buttons*/}
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

        {/*inline reply input*/}
        {showReply && (
          <div className="flex gap-2 items-center mt-2">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <ProfileIcon className="w-2.5 h-2.5 text-white" />
              )}
            </div>
            <input
              autoFocus
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSubmit()
                if (e.key === 'Escape') { setShowReply(false); setReplyText('') }
              }}
              placeholder="Write a reply..."
              className="flex-1 bg-white/10 text-white placeholder-white/30 font-body text-xs rounded-full px-3 py-1 outline-none focus:ring-1 focus:ring-red-orange/50"
            />
            <button
              onClick={handleSubmit}
              disabled={!replyText.trim()}
              className="text-red-orange font-body text-xs font-semibold disabled:opacity-40"
            >
              Post
            </button>
            <button
              onClick={() => { setShowReply(false); setReplyText('') }}
              className="text-white/30 font-body text-xs"
            >
              Cancel
            </button>
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
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('forum_comments')
      .select('id, body, created_at, parent_id, user_id, profiles(username, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
      .then(({ data }) => setAllComments(data || []))
  }, [id])

  async function handleReply(text, parentId = null) {
    if (!user || submitting) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('forum_comments')
      .insert({ post_id: id, user_id: user.id, body: text, parent_id: parentId })
      .select('id, body, created_at, parent_id, user_id, profiles(username, avatar_url)')
      .single()

    if (!error && data) {
      setAllComments(prev => [...prev, data])
      if (!parentId) setExpanded(true)
    }
    setSubmitting(false)
  }

  function handleDelete(commentId) {
    // Remove comment and all its children from state
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

  async function handleTopLevelReply() {
    if (!replyText.trim()) return
    await handleReply(replyText.trim(), null)
    setReplyText('')
    setShowReplyInput(false)
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
        <div className="flex gap-2 items-center mt-1 pl-3">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <ProfileIcon className="w-3 h-3 text-white" />
            )}
          </div>
          <input
            autoFocus
            type="text"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleTopLevelReply()
              if (e.key === 'Escape') { setShowReplyInput(false); setReplyText('') }
            }}
            placeholder="Write a reply..."
            className="flex-1 bg-white/10 text-white placeholder-white/30 font-body text-sm rounded-full px-4 py-1.5 outline-none focus:ring-1 focus:ring-red-orange/50"
          />
          <button
            onClick={handleTopLevelReply}
            disabled={!replyText.trim() || submitting}
            className="text-red-orange font-body text-sm font-semibold disabled:opacity-40"
          >
            {submitting ? '...' : 'Post'}
          </button>
          <button
            onClick={() => { setShowReplyInput(false); setReplyText('') }}
            className="text-white/30 font-body text-sm"
          >
            Cancel
          </button>
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