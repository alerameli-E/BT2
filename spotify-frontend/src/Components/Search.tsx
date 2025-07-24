import React from "react";
import type { Album, Artist, Track } from "../interfaces/interfaces";
import "../Styles/Search.css"
import TopArtistCard from "./TopArtistCard";
import AlbumCard from "./AlbumCard";
import { useNavigate } from "react-router-dom";
import Song from "./Song";

interface SearchInterface {
    searchTerm: string;
    songs: Track[] | null;
    albums: Album[] | null
    artists: Artist[] | null;
}

const Search: React.FC<SearchInterface> = ({ searchTerm, songs, albums, artists }) => {

    const navigate = useNavigate()

    console.log(albums)
    const handleClickAlbum = (albumId: string, artistId: string) => {
        navigate(`/artist/${artistId}`, {
            state: { selectedAlbumId: albumId }
        });
    };


    return (
        <div className="search-dashboard">

            <div className="search-dashboard-1">
                <h1>Results for "{searchTerm}"</h1>
                <div>
                    <h2>Artists</h2>
                    <div className="search-artists-grid">
                        {artists?.map((artist) => (
                            <TopArtistCard artist={artist} />
                        ))}
                    </div>

                </div>
                <div>
                    <h2>
                        Albums
                    </h2>
                    <div className="search-album-grid">
                        {albums?.map((album) => (
                            <AlbumCard
                                album={album}
                                handleClickAlbum={() => handleClickAlbum(album.id, album.artists[0].id)}
                                context="dashboard"
                            />
                        ))}
                    </div>

                </div>
            </div>
            <div className="search-dashboard-2">
                <h2>
                    Songs
                </h2>
                <div className="search-songs-container">
                    {songs?.map((song) => (
                        <Song track={song} />
                    ))}
                </div>

            </div>


        </div>
    )
}

export default Search