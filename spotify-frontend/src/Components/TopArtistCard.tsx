import React from "react";
import type { Artist } from "../interfaces/interfaces";
import "../Styles/TopArtistCard.css"
import { useNavigate } from "react-router-dom";

interface TopArtistCardInterface {
    artist: Artist;
}

const TopArtistCard: React.FC<TopArtistCardInterface> = ({ artist }) => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/artist/${artist.id}`);
      };

    return (
        <div className="tac-card">
            <img src={artist.images[0]?.url} alt={artist.name} className="tac-image" onClick={handleClick}/>
            <div className="tac-information">
                <h4 className="tac-name" onClick={handleClick}>{artist.name}</h4>
                <p className="tac-genres">
                    {artist.genres.length > 3
                        ? `${artist.genres.slice(0, 3).join(", ")}, ...`
                        : artist.genres.join(", ")}
                </p>

            </div>

        </div>

        
    );
};

export default TopArtistCard;
