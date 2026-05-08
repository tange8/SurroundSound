import { useState } from 'react'
import avatar1 from '../assets/SophiaAvatar.png'

function CreatePage() {
  const [title, setTitle] = useState('')
  const [event, setEvent] = useState('')
  const [body, setBody] = useState('')
  const [media, setMedia] = useState(null)

  const handlePost = () => {
    // wire up to supabase later
    console.log({ title, event, body, media })
  }

  return (
    <div className="flex justify-center items-start py-10 px-4">
      <div
        className="w-full max-w-xl rounded-2xl p-8 flex flex-col gap-4"
        style={{
          border: '1.5px solid transparent',
          backgroundImage: 'linear-gradient(#00002C, #00002C), linear-gradient(to bottom, #4133FF, #A100FF)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}
      >
        {/* Heading */}
        <h1 className="text-center text-white font-display font-bold text-2xl mb-2">
          Create Post
        </h1>

        {/* Avatar + username */}
        <div className="flex items-center gap-3">
          <img src={avatar1} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          <span className="text-lavendar font-body text-sm">@dlwlrma</span>
        </div>

        {/* Title input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/10 text-white placeholder-lavendar/60 font-body text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blurple"
        />

        {/* Choose Event dropdown */}
        <select
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className="w-full bg-white/10 text-white font-body text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blurple appearance-none"
        >
          <option value="" className="bg-dark-blue">Choose Event</option>
          <option value="taylor" className="bg-dark-blue">Taylor Swift at SoFi Stadium</option>
          <option value="sabrina" className="bg-dark-blue">Sabrina Carpenter at Crypto.com Arena</option>
          <option value="harry" className="bg-dark-blue">Harry Styles at SoFi Stadium</option>
        </select>

        {/* Upload Media */}
        <label className="w-full bg-red-orange hover:bg-purple transition-colors text-white font-display font-semibold text-sm rounded-full px-4 py-3 flex items-center justify-center gap-2 cursor-pointer">
          🖼 Upload Media
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </label>
        {media && <p className="text-lavendar/70 text-xs font-body px-2">{media.name}</p>}

        {/* Body textarea */}
        <textarea
          placeholder="What's on your mind?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full bg-white/10 text-white placeholder-lavendar/60 font-body text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blurple resize-none"
        />

        {/* Post button */}
        <button
          onClick={handlePost}
          className="w-2/3 mx-auto bg-red-orange hover:bg-purple transition-colors text-white font-display font-bold text-lg rounded-full py-3 mt-2"
        >
          Post
        </button>

      </div>
    </div>
  )
}

export default CreatePage