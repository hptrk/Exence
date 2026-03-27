package com.exence.finance.modules.auth.repository;

import com.exence.finance.modules.auth.dto.SessionSummaryProjection;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.Token;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByJwtId(String jwtId);

    @Modifying
    @Query("UPDATE Token t SET t.revoked = true " + "WHERE t.user.id = :userId " + "AND t.revoked = false")
    int revokeAllValidTokensByUser(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Token t SET t.revoked = true " + "WHERE t.user.id = :userId "
            + "AND t.tokenType = :tokenType "
            + "AND t.revoked = false")
    int revokeAllValidTokensByUserAndType(@Param("userId") Long userId, @Param("tokenType") TokenType tokenType);

    @Modifying
    @Query("UPDATE Token t SET t.revoked = true " + "WHERE t.user.id = :userId "
            + "AND t.tokenType IN :types "
            + "AND t.revoked = false")
    int revokeAllValidTokensByUserAndTypes(@Param("userId") Long userId, @Param("types") List<TokenType> types);

    @Modifying
    @Query("UPDATE Token t SET t.revoked = true " + "WHERE t.user.id = :userId "
            + "AND t.sessionId = :sessionId "
            + "AND t.revoked = false")
    int revokeAllValidTokensByUserAndSession(@Param("userId") Long userId, @Param("sessionId") String sessionId);

    @Modifying
    @Query("UPDATE Token t SET t.revoked = true " + "WHERE t.user.id = :userId "
            + "AND t.sessionId != :currentSessionId "
            + "AND t.revoked = false")
    int revokeAllValidTokensByUserExceptSession(
            @Param("userId") Long userId, @Param("currentSessionId") String currentSessionId);

    @Modifying
    @Query("UPDATE Token t SET t.revoked = true " + "WHERE t.user.id = :userId "
            + "AND t.tokenType IN :types "
            + "AND t.userAgent = :userAgent "
            + "AND t.ipAddress = :ipAddress "
            + "AND t.revoked = false")
    int revokeAllValidTokensByUserAndDevice(
            @Param("userId") Long userId,
            @Param("types") List<TokenType> types,
            @Param("userAgent") String userAgent,
            @Param("ipAddress") String ipAddress);

    @Modifying
    @Query("UPDATE Token t SET t.revoked = true " + "WHERE t.user.id = :userId "
            + "AND t.sessionId = :sessionId "
            + "AND t.tokenType = :tokenType "
            + "AND t.revoked = false")
    int revokeAllValidTokensByUserAndTypeAndSession(
            @Param("userId") Long userId,
            @Param("tokenType") TokenType tokenType,
            @Param("sessionId") String sessionId);

    @Modifying
    @Query("DELETE FROM Token t " + "WHERE t.revoked = true " + "OR t.expiresAt <= :now")
    int deleteExpiredOrRevokedTokens(@Param("now") Instant now);

    @Query(
            value =
                    """
        SELECT t.session_id,
               t.user_agent,
               t.ip_address,
               MAX(t.last_used_at),
               MIN(t.created_at)
        FROM token t
        WHERE t.user_id = :userId
          AND CAST(t.token_type AS TEXT) = :#{T(com.exence.finance.modules.auth.dto.TokenType).REFRESH.name()}
          AND t.revoked = false
          AND t.expires_at > :now
          AND t.session_id IS NOT NULL
        GROUP BY t.session_id, t.user_agent, t.ip_address
        ORDER BY MAX(t.last_used_at) DESC
        """,
            nativeQuery = true)
    List<SessionSummaryProjection> findActiveSessionsByUser(@Param("userId") Long userId, @Param("now") Instant now);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END " + "FROM Token t WHERE t.jwtId = :jwtId "
            + "AND t.revoked = false "
            + "AND t.expiresAt > :now")
    boolean existsByJwtIdAndNotRevokedAndNotExpired(@Param("jwtId") String jwtId, @Param("now") Instant now);
}
