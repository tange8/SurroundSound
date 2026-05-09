export default function EventPageDetails({
                                             description = "The Taylor Swift Eras Tour is a concert tour that spans all of Taylor Swift's music, from her first album to her latest releases, and includes special surprise songs and extended versions of some tracks. It's a journey through the artist's different musical \"eras,\" featuring various props and performing styles to reflect the moods and aesthetics of each album.",
                                             ages = "All Ages",
                                             onSale = "March 12, 2026 at 10:00am",
                                             forumPosts = [
                                                 { id: 1, title: "Eras Tour Outfit Inspo" },
                                                 { id: 2, title: "Parking Struggles" },
                                                 { id: 3, title: "munch spots before taylor" },
                                                 { id: 4, title: "ready for the bracelet trade wars" },
                                             ],
                                             onForumPostClick = (post) => {},
                                         }) {
    return (
        <div className="w-full flex flex-col sm:flex-row gap-4">

            {/* Left: Map placeholder */}
            <div
                className="w-full sm:w-[55%] aspect-square sm:aspect-auto rounded-xl overflow-hidden flex-shrink-0"
                style={{ minHeight: "200px" }}
            >
                <div className="w-full h-full bg-gray-700 rounded-xl" />
            </div>

            {/* Right: About + Forum */}
            <div className="flex flex-col gap-4 flex-1">

                {/* About This Event */}
                <div
                    className="rounded-xl p-5 flex flex-col gap-3 bg-darker-blue"
                    style={{
                        border: "1px solid #FF3831",
                    }}
                >
                    <h3 className="text-white text-lg font-semibold font-display">
                        About This Event
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-text">
                        {description}
                    </p>
                    <div className="text-sm font-text text-gray-200 flex flex-col gap-1">
                        <p>
                            <span className="font-semibold text-white">Ages:</span> {ages}
                        </p>
                        <p>
                            <span className="font-semibold text-white">On Sale:</span> {onSale}
                        </p>
                    </div>
                </div>

                {/* Recent Forum Posts */}
                <div
                    className="rounded-xl p-5 flex flex-col gap-3 bg-darker-blue"
                    style={{
                        border: "1px solid #FF3831",
                    }}
                >
                    <h3 className="text-white text-lg font-semibold font-display">
                        Recent Forum Posts
                    </h3>

                    {forumPosts.length === 0 ? (
                        <p className="text-gray-400 text-sm font-text">
                            No forum posts yet for this event.
                        </p>
                    ) : (
                        <ul className="flex flex-col">
                            {forumPosts.map((post, index) => (
                                <li key={post.id}>
                                    <button
                                        onClick={() => onForumPostClick(post)}
                                        className="w-full text-left text-white text-sm font-text py-3 hover:text-red-orange transition-colors"
                                    >
                                        {post.title}
                                    </button>
                                    {index < forumPosts.length - 1 && (
                                        <div className="h-px bg-white/10" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}