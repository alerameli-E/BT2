package com.example.Spotify_Backend;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("")
public class AuthorizationController {

    @Autowired
    private SpotifyAuthManagerService spotifyAuthService;

    @PostMapping("/auth/spotify")
    public Mono<Map<String, Object>> authenticate(@RequestBody Map<String, String> body) {

        String code = body.get("code");
        String sessionId = body.get("sessionId");

        try {
            return spotifyAuthService.authenticate(code, sessionId);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    @PostMapping("/auth/spotify/refresh")
    public Mono<Map<String, Object>> refreshToken(@RequestBody Map<String, String> body) {
        String sessionId = body.get("sessionId");
        try {
            return spotifyAuthService.refresh(sessionId);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    @DeleteMapping("/auth/spotify/logOut/{sessionId}")
    public ResponseEntity<Void> logOut(@PathVariable String sessionId) {
        if (spotifyAuthService.logout(sessionId)) {
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

}
