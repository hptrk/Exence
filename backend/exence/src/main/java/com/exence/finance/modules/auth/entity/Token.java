package com.exence.finance.modules.auth.entity;

import com.exence.finance.modules.auth.dto.TokenType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

import static com.exence.finance.common.util.ValidationConstants.IP_ADDRESS_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TOKEN_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.USER_AGENT_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.UUID_LENGTH;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = { "user" })
@ToString(callSuper = true, exclude = { "user", "token" })
@Table(name = "token")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "token_id_seq")
    @SequenceGenerator(name = "token_id_seq", sequenceName = "token_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "token_value", nullable = false, unique = true, length = TOKEN_MAX_LENGTH)
    private String token;

    @Column(name = "jwt_id", unique = true, length = UUID_LENGTH)
    private String jwtId;

    @Column(name = "session_id", length = UUID_LENGTH)
    private String sessionId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "token_type", nullable = false)
    private TokenType tokenType;

    @NotNull(message = "Revoked status is required")
    @Column(name = "revoked", nullable = false)
    @Builder.Default
    private Boolean revoked = Boolean.FALSE;

    @NotNull
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @Column(name = "ip_address", length = IP_ADDRESS_MAX_LENGTH)
    private String ipAddress;

    @Column(name = "user_agent", length = USER_AGENT_MAX_LENGTH)
    private String userAgent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(Instant.now());
    }

    public boolean isValid() {
        return !revoked && !isExpired();
    }
}
