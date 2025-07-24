package com.example.Spotify_Backend;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("")
public class SpotifyController {


    private final SpotifyService spotifyService;

    public SpotifyController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("/me")
    public Mono<String> getProfile(@RequestHeader("sessionId") String sessionId) {
        return spotifyService.getInformation("myInfo", sessionId, "");
    }

    @GetMapping("/me/top/artists")
    public Mono<String> getTopArtists(@RequestHeader("sessionId") String sessionId) {
        return spotifyService.getInformation("myTopArtists", sessionId, "");
    }

    @GetMapping("/me/albums")
    public Mono<String> getSavedAlbums(@RequestHeader("sessionId") String sessionId) {
       return spotifyService.getInformation("savedAlbums", sessionId, "");
    }

    @GetMapping("/me/top/songs")
    public Mono<String> getTopSongs(@RequestHeader("sessionId") String sessionId) {

        return spotifyService.getInformation("myTopSongs", sessionId, "");
    }

    @GetMapping("/artist/{id}")
    public Mono<String> getArtistInformation(@RequestHeader("sessionId") String sessionId, @PathVariable String id) {
        return spotifyService.getInformation("artistInfo", sessionId, id);
    }

    @GetMapping("/artistSongs/{id}")
    public Mono<String> getArtisTopSongs(@RequestHeader("sessionId") String sessionId, @PathVariable String id) {
        return spotifyService.getInformation("artistSongs", sessionId, id);
    }

    @GetMapping("/artistAlbums/{id}")
    public Mono<String> getArtistAlbums(@RequestHeader("sessionId") String sessionId, @PathVariable String id) {
        return spotifyService.getInformation("artistAlbums", sessionId, id);
    }

    @GetMapping("/albums/{id}")
    public Mono<String> getAlbumInfo(@RequestHeader("sessionId") String sessionId, @PathVariable String id) {
        return spotifyService.getInformation("albums", sessionId, id);
    }

    @GetMapping("/search/{searchValue}")
    public Mono<String> getSearchItems(@RequestHeader("sessionId") String sessionId, @PathVariable String searchValue) {
        return spotifyService.getInformation("search", sessionId, searchValue);
    }

}
