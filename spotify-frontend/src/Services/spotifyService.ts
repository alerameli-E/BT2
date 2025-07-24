import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


const callAPI = async (path: string, sessionId: string) => {
    try {
        const headers = { sessionId };
        const response = await axios.get(`${BASE_URL}${path}`, { headers });
        return response;
    } catch (error: any) {
        if (!error.response) {
            throw new Error("SERVER_UNAVAILABLE");
        }

        const status = error.response.status;

        if (status === 401) {
            throw new Error("UNAUTHORIZED");
        }

        if (status === 404) {
            throw new Error("NOT_FOUND");
        }

        if (status === 400) {
            throw new Error("BAD_REQUEST");
        }

        // Cualquier otro error
        throw new Error("UNKNOWN_ERROR");
    }
};


const callAPIWithParam = async (path: string, sessionId: string, param: string) => {
    try {
        const headers = { sessionId };
        const response = await axios.get(`${BASE_URL}${path}/${param}`, { headers });
        return response;
    } catch (error: any) {
        console.log("Error en el service: ", error)
        if (!error.response) {
            throw new Error("SERVER_UNAVAILABLE");
        }

        const status = error.response.status;

        if (status === 401) {
            throw new Error("UNAUTHORIZED");
        }

        if (status === 404) {
            throw new Error("NOT_FOUND");
        }

        if (status === 400) {
            throw new Error("BAD_REQUEST");
        }

        throw new Error("UNKNOWN_ERROR");
    }
}

export const deleteSession = async (sessionId: string) => {
    try {
        await axios.delete(`${BASE_URL}/auth/spotify/logOut/${sessionId}`)

    } catch (error) {
        console.error(`Error deleting session`, error);
        throw error;
    }
}

export const getMyInfo = (sessionId: string) => callAPI("/me", sessionId);
export const getMyTopArtist = (sessionId: string) => callAPI("/me/top/artists", sessionId);
export const getMySavedAlbums = (sessionId: string) => callAPI("/me/albums", sessionId);
export const getMyTopSongs = (sessionId: string) => callAPI("/me/top/songs", sessionId);
export const searchInformation = (sessionId: string, searchTerm: string) => callAPIWithParam("/search", sessionId, searchTerm)
export const getAlbumInformation = (sessionId: string, albumId: string) => callAPIWithParam("/albums", sessionId, albumId)
export const getArtistTopSongs = (sessionId: string, artistId: string) => callAPIWithParam("/artistSongs", sessionId, artistId)
export const getArtistInformation = (sessionId: string, artistId: string) => callAPIWithParam("/artist", sessionId, artistId)
export const getAlbumsFromArtist = (sessionId: string, artistId: string) => callAPIWithParam("/artistAlbums", sessionId, artistId)