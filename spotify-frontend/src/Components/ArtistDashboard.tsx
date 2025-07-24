import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Styles/Artist.css"
import Song from "./Song";
import type { Track } from "../interfaces/interfaces";
import AlbumSongs from "./AlbumSongs";
import type { Album } from "../interfaces/interfaces";
import { formatDuration } from "../utils";
import AlbumCard from "./AlbumCard";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Loading } from "./Loading";
import { getAlbumInformation, getAlbumsFromArtist, getArtistInformation, getArtistTopSongs } from "../Services/spotifyService";


const ArtistDashboard = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState<any>(null);
    const [songs, setSongs] = useState<Track[] | null>(null)
    const [albums, setAlbums] = useState<any>(null)
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const location = useLocation();
    const selectedAlbumId = location.state?.selectedAlbumId;

    const sessionId = localStorage.getItem("sessionId");

    const navigate = useNavigate()


    /*Variable sums the duration of all songs in an album*/
    const totalDurationMs = selectedAlbum?.tracks?.items?.reduce(
        (acc, track) => acc + track.duration_ms,
        0
    ) ?? 0;

    const handleClickAlbum = async (id: string) => {
        if (!sessionId) {
            return;
        }
        const response = await getAlbumInformation(sessionId, id);
        setSelectedAlbum(response.data);
    };


    useEffect(() => {

        const fetchData = async () => {

            try {
                if (!sessionId) {
                    navigate("/login")
                    return
                }

                if (!id) {
                    navigate("/not-found",
                        {
                            state: {
                                message: "Artist not found. Try with another id",
                                goto: ""
                            }
                        }
                    )
                    return
                }

                //Excluded from promise All, to avoid refreshers
                const responseSongs = await getArtistTopSongs(sessionId, id);

                const [responseAlbums, responseArtist] = await Promise.all([
                    getAlbumsFromArtist(sessionId, id),
                    getArtistInformation(sessionId, id)
                ]);

                setArtist(responseArtist.data)
                setAlbums(responseAlbums.data)
                setSongs(responseSongs.data.tracks)

                const firstAlbum = responseAlbums.data.items[0].id;
                const albumToLoad = selectedAlbumId || firstAlbum;
                await handleClickAlbum(albumToLoad);
                setIsLoading(false)

            } catch (error: any) {
                console.log("Error ", error)
                setIsLoading(false)

                if (error.message === "UNAUTHORIZED") {
                    navigate("/login", {
                        state: {
                            message: "Your session has expired. Please login again",
                            goto: "login"
                        }
                    });
                } else if (error.message === "SERVER_UNAVAILABLE") {
                    localStorage.removeItem("sessionId")
                    navigate("/not-found", {
                        state: {
                            message: "An error has ocurred with the server. Try logging in later",
                            goto: "login"
                        }
                    })
                } else if (error.message === "NOT_FOUND") {
                    navigate("/not-found", {
                        state: {
                            message: "Artist not found. Try with another id",
                            goto: ""
                        }
                    })
                } else {
                    setNotFound(true)
                }
            }
        }

        fetchData()

    }, [id, sessionId]);

    useEffect(() => {
        if (notFound) {
            navigate("/not-found", {
                state: {
                    message: "We couldn’t find the artist you were looking for.",
                    goto: ""
                }
            });
        }
    }, [notFound, navigate]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {artist && albums && songs && (
                <div className="artist-main-container">
                    {/* Sección Izquierda: Info + Top Songs */}
                    <div className="artist-section-1">
                        <div className="artist-information">
                            <img src={artist.images?.[0]?.url} alt={artist.name} />
                            <div className="artist-info-text">
                                <h1>{artist.name}</h1>
                                <p>{artist.followers.total.toLocaleString()} followers</p>
                                <p>{artist.genres.join(", ")}</p>
                            </div>
                        </div>

                        <div className="artist-top-songs">
                            <h2>Top Songs</h2>
                            <div className="artist-top-songs-grid">
                                {songs.map((item: Track) => (
                                    <Song track={item} key={item.id} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sección Derecha: Albums y Canciones */}
                    <div className="artist-section-2">
                        <div className="artist-albums">
                            <h2>Albums</h2>
                            <div className="albums-grid">
                                {albums.items.map((album: any) => (
                                    <AlbumCard
                                        album={album}
                                        handleClickAlbum={handleClickAlbum}
                                        context="artist"
                                        key={album.id}
                                    />
                                ))}
                            </div>
                        </div>

                        <div key={selectedAlbum?.id} className="album-songs">
                            {selectedAlbum?.tracks?.items && (
                                <>
                                    <div className="selected-album-header">
                                        <div className="album-title-date">
                                            <h2>{selectedAlbum.name}</h2>
                                            <span className="album-date">• ({new Date(selectedAlbum.release_date).getFullYear()})</span>
                                        </div>
                                        <div className="album-metadata">
                                            <span>{selectedAlbum.tracks.items.length} songs</span>
                                            <span>•</span>
                                            <span>{formatDuration(totalDurationMs)}</span>
                                        </div>
                                    </div>

                                    <div className="selected-album-content">
                                        <img src={selectedAlbum.images[0].url} />
                                        <div className="table-container">
                                            <AlbumSongs tracks={selectedAlbum.tracks.items} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );

};

export default ArtistDashboard;
