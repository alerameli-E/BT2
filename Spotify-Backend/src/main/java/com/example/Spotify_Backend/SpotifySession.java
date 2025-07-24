
package com.example.Spotify_Backend;

public class SpotifySession {
    private String accessToken;
    private String refreshToken;

    public int getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(int expires_in) {
        this.expires_in = expires_in;
    }
    private int expires_in; 

    public SpotifySession(String accessToken, String refreshToken, int expires_in) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expires_in = expires_in;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
