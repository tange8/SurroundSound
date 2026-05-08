function VenueCard({ image, name, location }) {
  return (
    <div className="relative shrink-0 w-52 cursor-pointer group flex flex-col items-center gap-3">

      {/* Image with blue gradient border */}
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          border: '1.5px solid transparent',
          backgroundImage: 'linear-gradient(#00002C, #00002C), linear-gradient(to bottom, #4133FF, #A100FF)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info below image */}
      <div className="text-center">
        <p className="text-white font-display text-sm">{name}</p>
        <p className="text-white font-body text-xs mt-1">{location}</p>
      </div>

    </div>
  )
}

export default VenueCard