import { useEffect, useState } from "react"
import { type Album, type Artist } from "../interfaces/interfaces"
import TopArtistCard from "./TopArtistCard"
import "../Styles/Dashboard.css"
import "../Styles/Navbar.css"
import { useNavigate } from "react-router-dom"
import type { Track } from "../interfaces/interfaces"
import Song from "./Song"
import AlbumCard from "./AlbumCard"
import { LogOut, Search } from "lucide-react"
import Modal from "./Modal"
import { House } from "lucide-react"
import { getMyInfo, getMySavedAlbums, getMyTopArtist, getMyTopSongs, searchInformation } from "../Services/spotifyService"

const DashBoard = () => {
    const [imageURL, setImageURL] = useState()
    const [topArtists, setTopArtists] = useState<Artist[]>([])
    const [topSongs, setTopSongs] = useState<Track[]>([])
    const [activeSearching, setActiveSearching] = useState<boolean>();
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [searchArtists, setSearchArtists] = useState<Artist[] | null>(null)
    const [searchSongs, setSearchSongs] = useState<Track[] | null>(null)
    const [searchAlbums, setSearchAlbums] = useState<Album[] | null>(null)
    const [savedAlbums, setSavedAlbums] = useState<Album[] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalContext, setModalContext] = useState<"logout" | "search">("logout")

    const [displaySearchTerm, setDisplaySearchTerm] = useState<string>("")

    const navigate = useNavigate()

    const sessionId = localStorage.getItem("sessionId")

    const handleLogOut = () => {
        setModalContext("logout")
        setIsModalOpen(true)
    }

    const handleSearch = async () => {

        if (searchTerm.length > 0) {
            setActiveSearching(true)
            try {

                if (!sessionId) {
                    navigate("/not-found", {
                        state: {
                            message: "No session found. Please login",
                            goto: "login"
                        }
                    });
                    return;
                }

                const response = await searchInformation(sessionId, searchTerm)

                setSearchSongs(response.data.tracks.items)
                setSearchAlbums(response.data.albums.items)
                setSearchArtists(response.data.artists.items)

                setDisplaySearchTerm(searchTerm)
                setSearchTerm("")

            } catch (error) {
                console.log(error)
            }
        } else {
            setModalContext("search")
            setIsModalOpen(true)
        }
    }

    const handleGoBack = () => {
        setActiveSearching(false)
    }

    const handleClickAlbum = (albumId: string, artistId: string) => {
        navigate(`/artist/${artistId}`, {
            state: { selectedAlbumId: albumId }
        });
    };

    useEffect(() => {

        const fetchData = async () => {
            try {

                if (!sessionId) {
                    navigate("/not-found", {
                        state: {
                            message: "No session found. Please login",
                            goto: "login"
                        }
                    });
                    return;
                }

                //Exclude one endpoint to avoid to many refreshers in the backend
                const myData = await getMyInfo(sessionId);

                const [topArtistsRes, topSongsRes, savedAlbumsRes] = await Promise.all([
                    getMyTopArtist(sessionId),
                    getMyTopSongs(sessionId),
                    getMySavedAlbums(sessionId)
                ]);


                /*Cleans response from API*/
                const albumsOnly = savedAlbumsRes.data.items.map((item: { album: Album }) => item.album);
                const tracksOnly = topSongsRes.data.items.map((item: { track: Track }) => item.track);

                setTopArtists(topArtistsRes.data.items)
                setTopSongs(tracksOnly);
                setSavedAlbums(albumsOnly)

                if (myData && myData.data.images.length > 1) {
                    setImageURL(myData.data.images[1].url);
                } else if (myData && myData.data.images.length > 0) {
                    setImageURL(myData.data.images[0].url);
                }

            } catch (error: any) {
                if (error.message === "UNAUTHORIZED") {
                    navigate("/login");
                } else if (error.message === "SERVER_UNAVAILABLE") {
                    localStorage.removeItem("sessionId")
                    navigate("/not-found", {
                        state: {
                            message: "An error has ocurred with the server. Try logging in later",
                            goto: "login"
                        }
                    })
                }
            }
        };

        fetchData();
    }, [sessionId]);

    return (
        <div className="dashboard-page">
            {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} context={modalContext} />}
            <div className="nav-bar">
                <div className="nav-bar-title">
                    <img src="spotifyLogo.png" width="10%" />
                    <h3>Spotify ++</h3>
                </div>
                <div className="dashboard-search-section">
                    {activeSearching && (
                        <button onClick={handleGoBack} className="dashboard-search-home-button">
                            <House />
                        </button>
                    )}

                    <input
                        placeholder="Search track, artist or album"
                        className={`dashboard-search-input ${!activeSearching ? "round-corner" : ""}`}
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />

                    <button className="dashboard-search-button" onClick={handleSearch} data-testid="search-button">

                        <Search />
                    </button>

                </div>
                <div className="nav-bar-profile">
                    <img src={imageURL} className="nav-bar-profile-image" />
                    <button onClick={handleLogOut} className="nav-bar-logout"><LogOut /></button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-first-section">

                    <div className="dashboard-ta-section">
                        <h3 className="dashboard-section-title">
                            {activeSearching ? "Artist Related To " + displaySearchTerm : "My Top Artists"}
                        </h3>
                        <div className="dashboard-ta-grid">
                            {activeSearching ?
                                searchArtists?.map((item) => (
                                    <TopArtistCard artist={item} />))
                                :
                                topArtists.map((item) => (
                                    <TopArtistCard artist={item} />))
                            }
                        </div>
                    </div>

                    <div className="dashboard-albums-section">
                        <h3 className="dashboard-section-title">
                            {activeSearching ? "Albums Related To " + displaySearchTerm : "Saved Albums"}
                        </h3>
                        <div className="dashboard-albums-grid" >
                            {activeSearching ?
                                searchAlbums?.map((album) => (
                                    <AlbumCard album={album} handleClickAlbum={() => handleClickAlbum(album.id, album.artists[0].id)} context="dashboard" />))
                                :
                                savedAlbums && savedAlbums.map((album) => (
                                    <AlbumCard album={album} handleClickAlbum={() => handleClickAlbum(album.id, album.artists[0].id)} context="dashboard" />
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className="dashboard-second-section">
                    <div className="dashboard-ts-section">
                        <h3 className="dashboard-section-title">
                            {activeSearching ? "Songs Related To " + displaySearchTerm : "My Top Songs"} </h3>
                        <div className="dashboard-ts-grid">
                            {activeSearching ?
                                searchSongs?.map((track) => (<Song track={track} />))
                                :
                                topSongs.map((track) => (
                                    <Song track={track} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashBoard