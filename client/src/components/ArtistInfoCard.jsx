import { useState } from "react";
import TaylorSwift from "../assets/TaylorSwift.png";

export default function ArtistInfoCard({
                                           artistName = "Taylor Swift",
                                           artistImage = TaylorSwift,
                                           genres = ["Pop", "Country", "Indie Folk"],
                                           monthlyListeners = "85.2M",
                                           artistPageUrl = "#",
                                       }) {
    const [following, setFollowing] = useState(false);

    return (
        <div className="relative w-full rounded-lg overflow-hidden">
            {/* Background gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(45deg, #4133FF 0%, #000013 70%, #000013 100%)",
                }}
            />

            {/* Card content */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 md:pr-6">

                {/* Artist image */}
                <div
                    className="w-full aspect-square md:w-[240px] md:flex-shrink-0 md:order-last rounded-xl overflow-hidden"
                    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                >
                    <img
                        src={artistImage}
                        alt={artistName}
                        className="w-full h-full object-cover object-top"
                    />
                </div>

                {/* Left: Info */}
                <div className="flex flex-col gap-4 md:gap-5 flex-1 min-w-0 w-full">
                    {/* Artist name */}
                    <div>
                        <h2 className="text-white text-3xl md:text-5xl font-display font-semibold leading-tight tracking-tight">
                            {artistName}
                        </h2>
                        <p className="text-lavender text-sm mt-1 font-text">
                            {monthlyListeners} monthly listeners
                        </p>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <span
                                key={genre}
                                className="px-3 py-1 rounded-full text-xs font-text text-white"
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                            >
                {genre}
              </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-1">
                        <button
                            onClick={() => setFollowing(!following)}
                            className="px-6 py-3 rounded-full text-white text-base font-text font-semibold transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: following
                                    ? "rgba(255,255,255,0.1)"
                                    : "linear-gradient(135deg, #FF3831, #cc2e27)",
                                border: following ? "1px solid rgba(255,255,255,0.3)" : "none",
                            }}
                        >
                            {following ? "Following ✓" : "Follow"}
                        </button>

                        <a
                            href={artistPageUrl}
                            className="text-lavender text-sm underline underline-offset-2 hover:text-white transition-colors font-text"
                        >
                            View on Spotify
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}