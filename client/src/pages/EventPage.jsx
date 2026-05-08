import { useParams } from "react-router-dom";
import EventInfoCard from "../components/EventInfoCard.jsx";
import EventPageDetails from "../components/EventPageDetails.jsx";

function EventPage() {
    const { eventId } = useParams();
    // use eventId to fetch the right event from your db

    return (
        <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
            <EventInfoCard />
            <EventPageDetails />
        </div>
    );
}

export default EventPage;