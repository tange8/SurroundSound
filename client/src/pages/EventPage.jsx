import { useParams } from 'react-router-dom'

function EventPage() {
// this is for later logic, for when we udpate based on the ievent clicked
  const { eventId } = useParams() 
  // use eventId to fetch the right event from your db
  return <div>Event Page</div>
}


export default EventPage