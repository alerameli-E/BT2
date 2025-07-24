import React from "react";
import "../Styles/AlbumSongs.css"

interface Album {
    name: string;
    album_type: string;
    release_date:string;
}

interface Track {
    name: string;
    album: Album;
    duration_ms: number;
}

interface AlbumSongsInterface {
    tracks: Track[];
}

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};
  

const AlbumSongs: React.FC<AlbumSongsInterface> = ({ tracks }) => {
    return (
       
            <table className="songs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                {tracks.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{formatDuration(item.duration_ms)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
    );
};

export default AlbumSongs;
