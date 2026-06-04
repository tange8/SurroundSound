export default function EventPageDetails({
  description = "No description available for this event.",
  ages = "All Ages",
  ticketUrl = "#",
  forumPosts = [],
  onForumPostClick = () => {},
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
          style={{ border: "1px solid #FF3831" }}
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
              <span className="font-semibold text-white">Tickets: </span>
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-orange underline underline-offset-2 hover:brightness-110 transition-colors"
              >
                Buy on Ticketmaster →
              </a>
            </p>
          </div>
        </div>

        {/* Recent Forum Posts */}
        <div
          className="rounded-xl p-5 flex flex-col gap-3 bg-darker-blue"
          style={{ border: "1px solid #FF3831" }}
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
                    className="w-full text-left py-3 flex flex-col gap-0.5 hover:text-red-orange transition-colors group"
                  >
                    <span className="text-white text-sm font-text group-hover:text-red-orange transition-colors">
                      {post.title}
                    </span>
                    <span className="text-gray-400 text-xs font-text">
                      @{post.profiles?.username} · {post.event_title}
                    </span>
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
  )
}