package com.example.Spotify_Backend;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class SpotifySessionStore {
    
    private final ConcurrentHashMap<String, SpotifySession> storedSessions = new ConcurrentHashMap<>();

    public void saveSession(String userId, SpotifySession session) {
        storedSessions.put(userId, session);
    }

    public SpotifySession getSession(String userId) {
        return storedSessions.get(userId);
    }

    public boolean hasSession(String userId) {
        return storedSessions.containsKey(userId);
    }
}
