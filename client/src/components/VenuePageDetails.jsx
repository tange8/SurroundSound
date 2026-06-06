import { useNavigate } from "react-router-dom";

export default function VenuePageDetails({
  description = null,
  childRule = null,
  parkingDetail = null,
  boxOfficePhone = null,
  boxOfficeHours = null,
  boxOfficePayment = null,
  upcomingEvents = [],
}) {
  const navigate = useNavigate();

  const sortedEvents = [...upcomingEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const hasAboutInfo = description || childRule || parkingDetail || boxOfficePhone || boxOfficeHours || boxOfficePayment

  return (
    <div className="w-full flex flex-col sm:flex-row gap-4">

      {/* Left: Upcoming Events */}
      <div
        className="w-full sm:w-[55%] flex-shrink-0 rounded-xl p-5 flex flex-col gap-3 bg-darker-blue"
        style={{ border: "1px solid #FF3831" }}
      >
        <h3 className="text-white text-lg font-semibold font-display">
          Upcoming Events
        </h3>

        {sortedEvents.length === 0 ? (
          <p className="text-gray-400 text-sm font-text">
            No upcoming events scheduled.
          </p>
        ) : (
          <ul className="flex flex-col">
            {sortedEvents.map((event, index) => (
              <li key={event.id}>
                <button
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="w-full text-left py-3 flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700">
                    {event.artistImage ? (
                      <img
                        src={event.artistImage}
                        alt={event.artistName}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <span className="text-white text-sm font-text font-medium flex-1 group-hover:text-red-orange transition-colors">
                    {event.artistName}
                  </span>

                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-text">{event.date}</p>
                    <p className="text-gray-400 text-xs font-text mt-0.5">{event.time}</p>
                  </div>
                </button>

                {index < sortedEvents.length - 1 && (
                  <div className="h-px bg-white/10" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right: About */}
      <div className="flex flex-col gap-4 flex-1">
        <div
          className="rounded-xl p-5 flex flex-col gap-4 bg-darker-blue"
          style={{ border: "1px solid #FF3831" }}
        >
          <h3 className="text-white text-lg font-semibold font-display">About</h3>

          {!hasAboutInfo ? (
            <p className="text-gray-400 text-sm font-text">
              No information available for this venue.
            </p>
          ) : (
            <div className="flex flex-col gap-4">

              {/* General Info */}
              {description && (
                <div className="flex flex-col gap-1">
                  <p className="text-white text-xs font-semibold font-text uppercase tracking-wide">
                    General Info
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed font-text">
                    {description}
                  </p>
                </div>
              )}

              {/* Child Rule */}
              {childRule && (
                <>
                  <div className="h-px bg-white/10" />
                  <div className="flex flex-col gap-1">
                    <p className="text-white text-xs font-semibold font-text uppercase tracking-wide">
                      Age Policy
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed font-text">
                      {childRule}
                    </p>
                  </div>
                </>
              )}

              {/* Parking */}
              {parkingDetail && (
                <>
                  <div className="h-px bg-white/10" />
                  <div className="flex flex-col gap-1">
                    <p className="text-white text-xs font-semibold font-text uppercase tracking-wide">
                      Parking
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed font-text">
                      {parkingDetail}
                    </p>
                  </div>
                </>
              )}

              {/* Box Office */}
              {(boxOfficePhone || boxOfficeHours || boxOfficePayment) && (
                <>
                  <div className="h-px bg-white/10" />
                  <div className="flex flex-col gap-2">
                    <p className="text-white text-xs font-semibold font-text uppercase tracking-wide">
                      Box Office
                    </p>
                    {boxOfficePhone && (
                      <p className="text-gray-300 text-sm font-text">
                        <span className="text-white font-semibold">Phone: </span>
                        {boxOfficePhone}
                      </p>
                    )}
                    {boxOfficeHours && (
                      <p className="text-gray-300 text-sm font-text">
                        <span className="text-white font-semibold">Hours: </span>
                        {boxOfficeHours}
                      </p>
                    )}
                    {boxOfficePayment && (
                      <p className="text-gray-300 text-sm font-text">
                        <span className="text-white font-semibold">Payment: </span>
                        {boxOfficePayment}
                      </p>
                    )}
                  </div>
                </>
              )}

            </div>
          )}
        </div>
      </div>

    </div>
  );
}