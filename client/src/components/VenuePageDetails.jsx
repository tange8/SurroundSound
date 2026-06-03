import { useNavigate } from "react-router-dom";
import TaylorSwift from "../assets/placeholders/TaylorSwift.png";

export default function VenuePageDetails({
                                             description = "SoFi Stadium is a state-of-the-art sports and entertainment destination in Inglewood, California. Home to the LA Rams and LA Chargers, the venue also hosts some of the world's biggest concerts and live events throughout the year.",
                                             upcomingEvents = [
                                                 { id: 1, artistName: "Taylor Swift", artistImage: TaylorSwift, date: "June 14, 2026", time: "7:00 PM" },
                                                 { id: 2, artistName: "Beyoncé", artistImage: null, date: "July 4, 2026", time: "8:00 PM" },
                                                 { id: 3, artistName: "Kendrick Lamar", artistImage: null, date: "July 19, 2026", time: "7:30 PM" },
                                                 { id: 4, artistName: "Sabrina Carpenter", artistImage: null, date: "August 2, 2026", time: "7:00 PM" },
                                             ],
                                         }) {
    const navigate = useNavigate();

    const sortedEvents = [...upcomingEvents].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

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
                                    {/* Artist profile picture */}
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

                                    {/* Artist name */}
                                    <span className="text-white text-sm font-text font-medium flex-1 group-hover:text-red-orange transition-colors">
                    {event.artistName}
                  </span>

                                    {/* Date + time */}
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
                    {description || 'No description available for this venue.'}
                    </p>
                </div>
            </div>

        </div>
    );
}