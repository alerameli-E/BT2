export interface Artist {
    id: string;
    name: string;
    href: string;
    genres: string[];
    images: { url: string }[];
    followers: { total: number };
    popularity: number;
}

export interface Track {
    id: string;
    name: string;
    duration_ms: number;
    preview_url: string | null;
    album: AlbumSimple;
}

export interface Album {
    id: string;
    name: string;
    album_type: string;
    release_date: string;
    images: { url: string }[];
    tracks: {
        items: Track[];
    };
    artists: SimplifiedArtist[];
}

export interface AlbumSimple {
    id: string;
    name: string;
    album_type: string;
    release_date: string;
    images: { url: string }[];
}

interface SimplifiedArtist {
    id: string;
    name: string;
  }