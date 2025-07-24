import React from "react";
import type { Track } from "../interfaces/interfaces";
import "../Styles/Song.css"

interface SongInterface {
    track: Track;
}

const Song: React.FC<SongInterface> = ({ track }) => {

    const formatedAlbum = track.album.name.length > 20 ? track.album.name.substring(0, 20) + "..." : track.album.name
    const formatedName = track.name.length > 20 ? track.name.substring(0, 20) + "..." : track.name

    return (
        <div className="song-card" title={track.name}>
            <img src={track.album.images?.[0]?.url} className="song-image" />
            <div className="song-info">
                <p className="song-name">
                    {formatedName}
                </p>
                <p className="song-album">
                    {track.album.album_type === "single"
                        ? `${formatedAlbum} - single`
                        : formatedAlbum}
                </p>
            </div>
        </div>
    )
}


export default Song