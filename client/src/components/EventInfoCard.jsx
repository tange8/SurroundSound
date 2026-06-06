import { useNavigate } from "react-router-dom";
import { useEventLike } from "../hooks/useEventLike";

export default function EventInfoCard({
  artistName = "Unknown Artist",
  artistImage = null,
  venue = "Unknown Venue",
  venueId = null,
  tmEventId = null,
  address = null,
  date = null,
  time = null,
  ticketUrl = "#",
  directionsUrl = "#",
  artistPageUrl = "#",
}) {
  const navigate = useNavigate();
  const { liked, toggleLike, isAuthenticated } = useEventLike(tmEventId)

  function handleLike() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    toggleLike()
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(45deg, #4133FF 0%, #000013 70%, #000013 100%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 md:pr-6">

        {/*artis timages*/}
        <div
          className="w-full aspect-square md:w-[240px] md:flex-shrink-0 md:order-last rounded-xl overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        >
          {artistImage ? (
            <img
              src={artistImage}
              alt={artistName}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center text-6xl">🎵</div>
          )}
        </div>

        {/* Left: Info */}
        <div className="flex flex-col gap-4 md:gap-5 flex-1 min-w-0 w-full">

          {/*name*/}
          <div>
            <h2 className="text-white text-3xl md:text-5xl font-display font-semibold leading-tight tracking-tight">
              {artistName}
            </h2>
            {artistPageUrl && artistPageUrl !== '#' && (
              <a
                href={artistPageUrl}
                className="text-lavender text-sm underline underline-offset-2 hover:text-white transition-colors mt-1 inline-block font-text"
              >
                View Artist Page
              </a>
            )}
          </div>

          {/* Venue + Date */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-12">
            <div>
              <h3
                onClick={() => venueId && navigate(`/venue/${venueId}`)}
                className={`text-white text-xl md:text-2xl font-semibold underline underline-offset-4 decoration-white/60 font-display
                  ${venueId ? 'cursor-pointer hover:text-lavender transition-colors' : ''}`}
              >
                {venue}
              </h3>
              {address && (
                <p className="text-white text-s mt-1 leading-snug max-w-[180px] font-text">
                  {address}
                </p>
              )}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lavender text-sm underline underline-offset-2 hover:text-white transition-colors mt-2 inline-block font-text"
              >
                Get directions
              </a>
            </div>

            <div>
              {date && (
                <p className="text-white text-xl md:text-2xl font-semibold font-display">{date}</p>
              )}
              {time && (
                <p className="text-white text-s mt-1 font-display">{time}</p>
              )}
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-4 mt-1">
            <button
              onClick={handleLike}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              aria-label="Save event"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-7 h-7 transition-colors"
                fill={liked ? "#FF3831" : "white"}
                stroke={liked ? "#FF3831" : "white"}
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white bg-red-orange text-base transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-lg font-text"
            >
              Buy Tickets →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}