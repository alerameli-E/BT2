package com.example.Spotify_Backend;

import java.util.Base64;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SpotifyAuthManagerService {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;
    
    @Value("${spotify.redirect.uri}")
    private String redirect_uri;

    private final WebClient webClient;
    
    public SpotifyAuthManagerService(WebClient webClient) {
    this.webClient = webClient;
}

    ConcurrentHashMap<String, SpotifySession> storedSessions = new ConcurrentHashMap<>();

    public Mono<Map<String, Object>> authenticate(String code, String sessionId) {

        String credentials = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

        return webClient.post()
                .uri("https://accounts.spotify.com/api/token")
                .header(HttpHeaders.AUTHORIZATION, "Basic " + credentials)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("code", code)
                        .with("redirect_uri", redirect_uri))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .doOnNext(response -> {

                    String accessToken = (String) response.get("access_token");
                    String refreshToken = (String) response.get("refresh_token");
                    int expires = (int) response.get("expires_in");

                    SpotifySession session = new SpotifySession(accessToken, refreshToken, expires);

                    storedSessions.put(sessionId, session);

                    printActiveSessions();

                });
    }
    
    public void printActiveSessions(){
        System.out.println("********** STORAGED SESSIONS ************");
        for (Entry<String, SpotifySession> entry : storedSessions.entrySet()) {
                        System.out.println("Session ID: " + entry.getKey());
                        System.out.println("Access Token: " + entry.getValue().getAccessToken());
                        System.out.println("Refresh Token: " + entry.getValue().getRefreshToken());
                        System.out.println("***************************************");
                    }
    }

    public Mono<Map<String, Object>> refresh(String sessionId) {
        
        printActiveSessions();

        System.out.println("The refresher has been used");
        
        SpotifySession session = storedSessions.get(sessionId);

        if (session == null) {
            return Mono.error(new RuntimeException("No session found for sessionId: " + sessionId));
        }

        String refreshToken = session.getRefreshToken();
        String credentials = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

        return webClient.post()
                .uri("https://accounts.spotify.com/api/token")
                .header(HttpHeaders.AUTHORIZATION, "Basic " + credentials)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .body(BodyInserters.fromFormData("grant_type", "refresh_token")
                        .with("refresh_token", refreshToken))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .doOnNext(response -> {

                    String newAccessToken = (String) response.get("access_token");
                    session.setAccessToken(newAccessToken);
                    storedSessions.put(sessionId, session);
                    
                    System.out.println("The refresher has got a new token");

                });
    }

    public SpotifySession getSession(String sessionId) {
        return storedSessions.get(sessionId);
    }

    public boolean logout(String sessionId) {
        printActiveSessions();
        System.out.println("Session "+sessionId+" deleted");
        return storedSessions.remove(sessionId) != null;
    }

    
    public void setStoredSessions(ConcurrentHashMap<String, SpotifySession> storedSessions) {
        this.storedSessions = storedSessions;
    }
}
