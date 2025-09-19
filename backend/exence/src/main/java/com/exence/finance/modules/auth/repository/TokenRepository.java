package com.exence.finance.modules.auth.repository;

import com.exence.finance.modules.auth.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    @Modifying
    @Query("UPDATE Token t SET t.expired = true, t.revoked = true " +
            "WHERE t.user.id = :userId " +
            "AND t.revoked = false " +
            "AND t.expired = false")
    int revokeAllValidTokensByUser(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Token t SET t.lastUsedAt = :lastUsedAt, t.ipAddress = :ipAddress, t.userAgent = :userAgent " +
            "WHERE t.token = :tokenValue")
    int updateTokenUsageInfo(@Param("tokenValue") String tokenValue,
                             @Param("lastUsedAt") Instant lastUsedAt,
                             @Param("ipAddress") String ipAddress,
                             @Param("userAgent") String userAgent);
// ...existing code...

    Optional<Token> findByToken(String token);
}
