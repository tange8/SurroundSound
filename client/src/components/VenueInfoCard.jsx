export default function VenueInfoCard({
                                          venueName = "SoFi Stadium",
                                          venueImage = null,
                                          address = "1001 S. Stadium Drive, Inglewood, CA 90301",
                                          website = "https://sofistadium.com",
                                          phone = "(310) 341-1000",
                                          capacity = "70,000",
                                          directionsUrl = "#",
                                      }) {
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

                {/* Venue image */}
                <div
                    className="w-full aspect-square md:w-[240px] md:flex-shrink-0 md:order-last rounded-xl overflow-hidden bg-gray-800"
                    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                >
                    {venueImage ? (
                        <img
                            src={venueImage}
                            alt={venueName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Left: Info */}
                <div className="flex flex-col gap-4 md:gap-5 flex-1 min-w-0 w-full">
                    {/* Venue name */}
                    <div>
                        <h2 className="text-white text-3xl md:text-5xl font-display font-semibold leading-tight tracking-tight">
                            {venueName}
                        </h2>
                        <p className="text-lavender text-sm mt-1 font-text">
                            Capacity: {capacity}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-3">
                        {/* Address */}
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-lavender mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <p className="text-white text-sm font-text">{address}</p>
                                <a
                                    href={directionsUrl}
                                    className="text-lavender text-xs underline underline-offset-2 hover:text-white transition-colors mt-0.5 inline-block font-text"
                                >
                                    Get directions
                                </a>
                            </div>
                        </div>

                        {/* Website */}
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-lavender flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lavender text-sm underline underline-offset-2 hover:text-white transition-colors font-text"
                            >
                                {website.replace("https://", "")}
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-lavender flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                            </svg>
                            <a
                                href={`tel:${phone}`}
                                className="text-lavender text-sm hover:text-white transition-colors font-text"
                            >
                                {phone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}