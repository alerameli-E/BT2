package com.example.Spotify_Backend;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

@WebFluxTest(controllers = SpotifyController.class)
public class SpotifyControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private SpotifyService spotifyService;
    
    private final String sessionId = "test-session";

    @Test
    void testGetProfile() {
        String mockResponse = "{\"name\": \"Mock User\"}";

        Mockito.when(spotifyService.getInformation("myInfo", sessionId, ""))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/me")
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testGetTopArtists() {
        String mockResponse = "{\"items\": [{\"name\": \"Mock Artist\"}]}";

        Mockito.when(spotifyService.getInformation("myTopArtists", sessionId, ""))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/me/top/artists")
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testGetSavedAlbums() {
        String mockResponse = "{\"items\": [{\"name\": \"Mock Album\"}]}";

        Mockito.when(spotifyService.getInformation("savedAlbums", sessionId, ""))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/me/albums")
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testGetTopSongs() {
        String mockResponse = "{\"items\": [{\"name\": \"Mock Song\"}]}";

        Mockito.when(spotifyService.getInformation("myTopSongs", sessionId, ""))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/me/top/songs")
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testGetArtistInfo() {
        String artistId = "123";
        String mockResponse = "{\"name\": \"Mock Artist\"}";

        Mockito.when(spotifyService.getInformation("artistInfo", sessionId, artistId))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/artist/{id}", artistId)
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testGetArtistTopSongs() {
        String artistId = "456";
        String mockResponse = "{\"tracks\": [{\"name\": \"Top Song\"}]}";

        Mockito.when(spotifyService.getInformation("artistSongs", sessionId, artistId))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/artistSongs/{id}", artistId)
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testGetArtistAlbums() {
        String artistId = "789";
        String mockResponse = "{\"items\": [{\"name\": \"Artist Album\"}]}";

        Mockito.when(spotifyService.getInformation("artistAlbums", sessionId, artistId))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/artistAlbums/{id}", artistId)
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testGetAlbumInfo() {
        String albumId = "999";
        String mockResponse = "{\"name\": \"Album Info\"}";

        Mockito.when(spotifyService.getInformation("albums", sessionId, albumId))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/albums/{id}", albumId)
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }

    @Test
    void testSearchItems() {
        String query = "beatles";
        String mockResponse = "{\"artists\": {\"items\": [{\"name\": \"The Beatles\"}]}}";

        Mockito.when(spotifyService.getInformation("search", sessionId, query))
                .thenReturn(Mono.just(mockResponse));

        webTestClient.get()
                .uri("/search/{searchValue}", query)
                .header("sessionId", sessionId)
                .exchange()
                .expectStatus().isOk()
                .expectBody().json(mockResponse);
    }
}
