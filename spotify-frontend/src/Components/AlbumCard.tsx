import React from "react";
import type { Album } from "../interfaces/interfaces";
import "../Styles/AlbumCard.css"

interface AlbumInterface {
    album: Album;
    handleClickAlbum: (id: string) => void;
    context: "artist" | "dashboard"
}


const AlbumCard: React.FC<AlbumInterface> = ({ album, handleClickAlbum, context }) => {
    return (
        <div key={album.id} className="album-card" onClick={() => handleClickAlbum(album.id)} title={album.name}>
            <img src={album.images?.[0]?.url} alt={album.name} />
            <p className="album-title">{album.name.length>20? album.name.substring(0,20)+"...":album.name}{album.album_type === "single" ? " - single" : ""}</p>
            <p className="album-year">
                {context === "dashboard" ? album.artists[0].name+ " • " : ""} {new Date(album.release_date).getFullYear()}
            </p>
        </div>
    )
}

export default AlbumCard