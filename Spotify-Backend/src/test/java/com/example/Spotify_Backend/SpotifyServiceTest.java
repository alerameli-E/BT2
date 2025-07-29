package com.example.Spotify_Backend;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.reactive.function.BodyInserter;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;


@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class SpotifyServiceTest {

    private SpotifyAuthManagerService spotifyAuthManagerService;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private WebClient.RequestBodySpec requestBodySpec;

    @Mock
    private WebClient.RequestHeadersSpec<?> requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @BeforeEach
    void setUp() {
        spotifyAuthManagerService = new SpotifyAuthManagerService(webClient);
        spotifyAuthManagerService.setStoredSessions(new ConcurrentHashMap<>());
    }

    @Test
    void authenticate_shouldStoreSessionAndReturnTokenResponse() {
        String code = "mockCode";
        String sessionId = "mockSession";

        Map<String, Object> tokenResponse = new HashMap<>();
        tokenResponse.put("access_token", "mockAccessToken");
        tokenResponse.put("refresh_token", "mockRefreshToken");
        tokenResponse.put("expires_in", 3600);

        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.header(anyString(), anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(BodyInserter.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(any(ParameterizedTypeReference.class)))
                .thenReturn(Mono.just(tokenResponse));

        when(responseSpec.bodyToMono(any(ParameterizedTypeReference.class)))
                .thenReturn(Mono.just(tokenResponse));

        Map<String, Object> result = spotifyAuthManagerService.authenticate(code, sessionId).block();

        assertNotNull(result);
        assertEquals("mockAccessToken", result.get("access_token"));
        assertEquals("mockRefreshToken", result.get("refresh_token"));
        assertEquals(3600, result.get("expires_in"));

        SpotifySession session = spotifyAuthManagerService.getSession(sessionId);
        assertNotNull(session);
        assertEquals("mockAccessToken", session.getAccessToken());
        assertEquals("mockRefreshToken", session.getRefreshToken());
        assertEquals(3600, session.getExpires_in());
    }

}
