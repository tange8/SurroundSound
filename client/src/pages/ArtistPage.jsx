import { useParams } from "react-router-dom";
import ArtistInfoCard from "../components/ArtistInfoCard.jsx";
import ArtistPageDetails from "../components/ArtistPageDetails.jsx";

function ArtistPage() {
    const { artistId } = useParams();
    // use artistId to fetch the right artist from your db

    return (
        <div className="flex flex-col mt-10 gap-10 max-w-4xl mx-auto">
            <ArtistInfoCard />
            <ArtistPageDetails />
        </div>
    );
}

export default ArtistPage;