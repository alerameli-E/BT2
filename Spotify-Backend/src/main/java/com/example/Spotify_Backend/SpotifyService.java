package com.example.Spotify_Backend;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SpotifyService {

    private final SpotifyAuthManagerService spotifyAuthManagerService;

    public SpotifyService(SpotifyAuthManagerService spotifyAuthManagerService) {
        this.spotifyAuthManagerService = spotifyAuthManagerService;
    }

    private final WebClient webClient = WebClient.create();

    public Mono<String> processInformation(String URL, SpotifySession session, String sessionId, int attempt) {

        return webClient.get()
                .uri(URI.create(URL))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + session.getAccessToken())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .onStatus(HttpStatus.UNAUTHORIZED::equals, response -> {
                    if (attempt == 0) {
                        // Retry after refresh
                        return spotifyAuthManagerService.refresh(sessionId)
                                .flatMap(refreshed -> {
                                    String newToken = (String) refreshed.get("access_token");

                                    session.setAccessToken(newToken);

                                    return processInformation(URL, session, sessionId, 1);
                                })
                                .then(Mono.empty()); // Block actual error signal until retry
                    }
                    return Mono.error(new RuntimeException("Unauthorized after retry"));
                })
                .onStatus(HttpStatus.NOT_FOUND::equals, response -> {
                    return Mono.error(new RuntimeException("NOT_FOUND"));
                })
                .onStatus(HttpStatus.BAD_REQUEST::equals, response -> {
                    return Mono.error(new RuntimeException("BAD_REQUEST"));
                })
                .bodyToMono(String.class);

    }

    public Mono<String> getInformation(String route, String sessionId, String additionalId) {

        SpotifySession session = spotifyAuthManagerService.getSession(sessionId);
        String URL = "https://api.spotify.com/v1/";

        switch (route) {

            case "myInfo" ->
                URL = URL + "me";

            case "myTopArtists" -> {
                String timeRange = "long_term";
                URL = URL + "me/top/artists?time_range=" + timeRange;
            }

            case "savedAlbums" -> {
                int limitOfValues = 10;
                URL = URL + "me/albums?limit=" + limitOfValues;
            }

            case "myTopSongs" -> {
                String timeRange = "long_term";
                int limitOfValues = 20;
                URL = URL + "me/tracks?time_range=" + timeRange + "&limit=" + limitOfValues;
            }

            case "artistInfo" ->
                URL = URL + "artists/" + additionalId;

            case "artistSongs" ->
                URL = URL + "artists/" + additionalId + "/top-tracks?market=US";

            case "artistAlbums" ->
                URL = URL + "artists/" + additionalId + "/albums";

            case "albums" ->
                URL = URL + "albums/" + additionalId;

            case "search" -> {
                String searchType = "album,track,artist";
                int limit = 15;

                URL = URL + "search?q=" + URLEncoder.encode(additionalId, StandardCharsets.UTF_8)
                        + "&type=" + URLEncoder.encode(searchType, StandardCharsets.UTF_8)
                        + "&limit=" + limit;
            }

            default -> {
            }
        }
        System.out.println(URL);

        return processInformation(URL, session, sessionId, 0);

    }
}
