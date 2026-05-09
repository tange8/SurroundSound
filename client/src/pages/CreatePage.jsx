import { useState } from 'react'
import avatar1 from '../assets/placeholders/SophiaAvatar.png'
import MediaIcon from '../assets/icons/MediaIcon.svg?react'

function CreatePage() {
  const [title, setTitle] = useState('')
  const [event, setEvent] = useState('')
  const [body, setBody] = useState('')
  const [media, setMedia] = useState(null)

  const handlePost = () => {
    console.log({ title, event, body, media })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">

      {/*title and profile */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4">
        <h1 className="text-white font-display font-bold text-2xl">Create Post</h1>
        <div className="flex items-center gap-2">
          <img src={avatar1} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-lavendar font-body text-sm">@memequeenmanon</span>
        </div>
      </div>

      {/*title for the post */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-white/10 text-white placeholder-lavendar/60 font-body text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blurple"
      />

      {/*  event drop down */}
      {/* this will later call saved events?? liked events? */}
      <select
        value={event}
        onChange={(e) => setEvent(e.target.value)}
        className="w-full bg-white/10 text-white font-body text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blurple appearance-none"
      >
        <option value="" className="bg-dark-blue">Choose Event</option>
        <option value="taylor" className="bg-dark-blue">Taylor Swift at SoFi Stadium</option>
        <option value="sabrina" className="bg-dark-blue">Sabrina Carpenter at Crypto.com Arena</option>
        <option value="harry" className="bg-dark-blue">Harry Styles at SoFi Stadium</option>
      </select>

      {/* Upload Media */}
      <label className="w-full bg-red-orange hover:bg-pink transition-colors text-white font-display text-sm rounded-full px-4 py-3 flex items-center justify-center gap-2 cursor-pointer">
         <MediaIcon className="w-5 h-5" />
         Upload Media
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setMedia(e.target.files[0])}
        />
      </label>
      {media && <p className="text-lavendar/70 text-xs font-body px-2">{media.name}</p>}

      {/* text area*/}
      <textarea
        placeholder="What's on your mind?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        className="w-full bg-white/10 text-white placeholder-lavendar/60 font-body text-sm rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blurple resize-none"
      />

      {/* post button */}
      <button
        onClick={handlePost}
        className="w-1/3 mx-auto bg-red-orange hover:bg-pink transition-colors text-white font-display font-bold text-lg rounded-full py-3"
      >
        Post
      </button>

    </div>
  )
}

export default CreatePage