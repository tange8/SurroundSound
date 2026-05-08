import { useParams } from "react-router-dom";
import VenueInfoCard from "../components/VenueInfoCard.jsx";
import VenuePageDetails from "../components/VenuePageDetails.jsx";

function VenuePage() {
    const { venueId } = useParams();
    // use venueId to fetch the right venue from your db

    return (
        <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
            <VenueInfoCard />
            <VenuePageDetails />
        </div>
    );
}

export default VenuePage;