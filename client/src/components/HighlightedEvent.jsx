import { useNavigate } from 'react-router-dom'

function HighlightedEvent({ image, artist, eventId }) {
  const navigate = useNavigate()

  return (
    <div className="relative md:mx-8 mt-6 rounded-xl overflow-hidden h-96 cursor-pointer">

      {/* Background Image */}
      <img
        src={image}
        alt={artist}
        className="w-full h-full object-cover object-[center_20%]"
      />

      {/*dark gradent*/}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Text + Button */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-3">
        <h2 className="text-white text-3xl font-display drop-shadow-lg">
          <span className="text-white font-display">{artist}</span> On Tour Now!
        </h2>

        <button
          onClick={() => navigate(`/event/${eventId}`)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-display px-5 py-2 rounded-full w-fit transition-colors"
        >
          Check it out →
        </button>
      </div>

    </div>
  )
}

export default HighlightedEvent