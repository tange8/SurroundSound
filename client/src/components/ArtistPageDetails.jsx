import { useNavigate } from "react-router-dom";

export default function ArtistPageDetails({
                                              description = "Taylor Swift is a multi-genre singer-songwriter known for her narrative songwriting and genre evolution across country, pop, and indie folk. With over a decade of critically acclaimed albums, she has become one of the best-selling music artists of all time.",
                                              genres = ["Pop", "Country", "Indie Folk", "Alternative"],
                                              upcomingEvents = [
                                                  { id: 1, venue: "SoFi Stadium", city: "Los Angeles, CA", date: "June 14, 2026", time: "7:00 PM", nearby: true },
                                                  { id: 2, venue: "Allegiant Stadium", city: "Las Vegas, NV", date: "June 20, 2026", time: "7:00 PM", nearby: true },
                                                  { id: 3, venue: "Chase Center", city: "San Francisco, CA", date: "June 28, 2026", time: "8:00 PM", nearby: false },
                                                  { id: 4, venue: "Madison Square Garden", city: "New York, NY", date: "July 10, 2026", time: "7:30 PM", nearby: false },
                                                  { id: 5, venue: "United Center", city: "Chicago, IL", date: "July 18, 2026", time: "7:00 PM", nearby: false },
                                              ],
                                          }) {
    const navigate = useNavigate();

    // Nearby events first, then rest sorted by date
    const sortedEvents = [...upcomingEvents].sort((a, b) => {
        if (a.nearby && !b.nearby) return -1;
        if (!a.nearby && b.nearby) return 1;
        return new Date(a.date) - new Date(b.date);
    });

    return (
        <div className="w-full flex flex-col sm:flex-row gap-4">

            {/* Left: Upcoming Concerts */}
            <div
                className="w-full sm:w-[55%] flex-shrink-0 rounded-xl p-5 flex flex-col gap-3 bg-darker-blue"
                style={{ border: "1px solid #FF3831" }}
            >
                <h3 className="text-white text-lg font-semibold font-display">
                    Upcoming Concerts
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
                                    className="w-full text-left py-3 flex items-center justify-between gap-4 group transition-colors hover:text-red-orange"
                                >
                                    {/* Left: venue + city */}
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-text font-medium group-hover:text-red-orange transition-colors truncate">
                        {event.venue}
                      </span>
                                            {event.nearby && (
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-text flex-shrink-0"
                                                    style={{
                                                        background: "rgba(255,56,49,0.15)",
                                                        border: "1px solid rgba(255,56,49,0.4)",
                                                        color: "#FF3831",
                                                    }}
                                                >
                          Nearby
                        </span>
                                            )}
                                        </div>
                                        <span className="text-gray-400 text-xs font-text mt-0.5">
                      {event.city}
                    </span>
                                    </div>

                                    {/* Right: date + time */}
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
                    <h3 className="text-white text-lg font-semibold font-display">
                        About
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed font-text">
                        {description}
                    </p>

                    {/* Genres */}
                    <div>
                        <p className="text-white text-sm font-semibold font-text mb-2">
                            Genres
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 rounded-full text-xs font-text text-white"
                                    style={{
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                    }}
                                >
                  {genre}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}