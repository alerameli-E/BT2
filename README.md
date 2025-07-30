
#  Spotify API

This project is a **full stack application** that integrates with the **Spotify Web API** to authenticate users, display personalized information, and allow exploration of musical content. It implements OAuth authentication, a user dashboard, artist and album navigation, search functionality, and secure session management.

##  Repository Structure
```
. ├── docker-compose.yaml 
  ├── frontend/
  │     ├── Dockerfile
  │     └── (React + TypeScript source code)
  └── backend/ 
        ├── Dockerfile 
        └── (Spring Boot + Java source code)
```

## How to Run the Project

1. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
2. **Backend**
   ```bash
   cd backend
   ./gradlew clean build
   cd ..
3. **Build and start containers**
   ```bash
   docker-compose up --build

## Backend Endpoints
All endpoints require a sessionId header to identify the user's session.

User Profile and Content

- GET /me — User profile information
- GET /me/top/artists — Top artists
- GET /me/albums — Saved albums
- GET /me/top/songs — Top songs
  
Artist and Album Information

- GET /artist/{id} — Artist details
- GET /artistSongs/{id} — Artist's top songs
- GET /artistAlbums/{id} — Artist's albums
- GET /albums/{id} — Album details
  
Search

- GET /search/{searchValue} — Search for songs, artists, or albums
  
Authentication

- POST /auth/spotify — Authenticate using Spotify authorization code
- DELETE /auth/spotify/logOut/{sessionId} — Log out and invalidate session

## Session Management
Upon authentication, the frontend generates a sessionId (UUID) and stores it in localStorage. This sessionId is sent to the backend, where it is mapped to a SpotifySession object stored in a HashMap:

```java
public class SpotifySession {
    private String accessToken;
    private String refreshToken;
    private int expires_in;
}
```

This object holds the access and refresh tokens along with their expiration time, allowing secure and efficient session handling.

## Enviorment variables

This project uses environment variables to store sensitive information such as API keys and secrets. These variables are defined in a .env file located at the backend folder.

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://127.0.0.1:8080/callback
```
To get the Spotify client ID and Spotify secret, it must be created an app at spotify page for developers at https://developer.spotify.com/dashboard. When creating the app, in the field Redirect URI, set: http://127.0.0.1:8080/callback. Then the client ID and client secret can be found on top of the form. The name of the variables in .env document must be the same as shown in the example. 

## Technologies Used
- Frontend: React, TypeScript, Docker
- Backend: Java, Spring Boot, Gradle, Docker
- Orchestration: Docker Compose
- API: Spotify Web API
- Authentication: OAuth 2.0
