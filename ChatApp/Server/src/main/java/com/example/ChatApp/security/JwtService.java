package com.example.ChatApp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "minha-chave-super-secreta-1234567890";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(Long client_id) {
        return Jwts.builder()
                .subject(String.valueOf(client_id))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) //1h
                .signWith(key)
                .compact();
    }

    // 🔹 extrair client_id
    public Long extractUserId(String token) {
        return Long.parseLong(
                getClaims(token).getSubject()
        );
    }

    // 🔹 validar token
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token.replace("Bearer ", ""))
                .getPayload();
    }
}