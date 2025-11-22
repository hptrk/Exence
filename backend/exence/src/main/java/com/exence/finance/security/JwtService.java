package com.exence.finance.security;

import com.exence.finance.config.properties.JwtProperties;
import com.exence.finance.modules.auth.dto.TokenType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    private final JwtProperties jwtProperties;

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }
    
    public String extractJwtId(String token) {
        return extractClaim(token, Claims::getId);
    }
    
    public Date extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }

    public Date extractExpiresAt(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public TokenType extractTokenType(String token) {
        Claims claims = extractAllClaims(token);
        String type = (String) claims.get("type");

        if (type == null) {
            throw new IllegalArgumentException("Token type claim is missing");
        }

        return TokenType.valueOf(type);
    }

    public boolean isTokenStructureValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            log.debug("Token structure validation failed: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenOfType(String token, TokenType expectedType) {
        TokenType actualType = extractTokenType(token);
        return expectedType.equals(actualType);
    }

    public boolean matchesUsername(String token, String username) {
        return username.equals(extractUsername(token));
    }

    public String generateToken(UserDetails userDetails, TokenType tokenType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", tokenType.name());
        Instant expiration = calculateTokenExpiration(tokenType);

        return buildToken(claims, userDetails, expiration);
    }

    public Instant calculateTokenExpiration(TokenType tokenType){
        Duration expiration = switch (tokenType) {
            case ACCESS -> jwtProperties.getAccessTokenExpiration();
            case REFRESH -> jwtProperties.getRefreshTokenExpiration();
            case PASSWORD_RESET -> jwtProperties.getPasswordResetTokenExpiration();
            case EMAIL_VERIFICATION -> jwtProperties.getEmailVerificationTokenExpiration();
        };

        return Instant.now().plus(expiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, Instant expiration){
        String jti = UUID.randomUUID().toString();
        Instant now = Instant.now();

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setId(jti)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
