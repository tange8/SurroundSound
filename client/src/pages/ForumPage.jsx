import ForumPost from '../components/ForumPost'
import avatar1 from '../assets/SophiaAvatar.png'

const placeholderPosts = [
  {
    id: 1,
    avatar: avatar1,
    username: '@sophiathebean',
    timestamp: '32 min. ago',
    event: 'Taylor Swift at SoFi Stadium',
    title: 'Eras Tour Outfit Inspo',
    body: 'check out this jacket I made for the Eras Tour!',
    image: '/src/assets/jacket.png',
  },
  {
    id: 2,
    avatar: avatar1,
    username: '@memequeenmanon',
    timestamp: '4 hr. ago',
    event: 'Harry Styles at SoFi Stadium',
    title: 'Parking Struggles',
    body: "does anyone know if there are better places to park for the eras tour? I'm not tryna pay 50 bucks for parking",
    image: null,
  },
  {
    id: 3,
    avatar: avatar1,
    username: '@larabar',
    timestamp: '2 days ago',
    event: 'Sabrina Carpenter at Crypto.com Arena',
    title: 'Looking for a seat mate',
    body: "hey guys! I really want to go to sabrina's concert but I don't know anyone who listens to her. if anyone's looking for someone to sit with contact me and we can be besties!",
    image: null,
  },
]

function ForumPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Header */}
      <h1 className="text-white font-display font-bold text-2xl mb-6">Forum</h1>

      {/* Posts */}
      {placeholderPosts.map(post => (
        <ForumPost key={post.id} {...post} />
      ))}

    </div>
  )
}

export default ForumPage