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
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "TOKEN", uniqueConstraints = { @UniqueConstraint(columnNames = "ID") })
@SequenceGenerator(name = "token_gen", sequenceName = "token_id_seq", allocationSize = 1)
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "token_gen")
    private Long id;

    @NotNull
    @Column(name = "TOKEN_VALUE", nullable = false, unique = true, length = TOKEN_MAX_LENGTH)
    private String token;

    @Column(name = "JWT_ID", unique = true, length = UUID_LENGTH)
    private String jwtId;

    @Column(name = "SESSION_ID", length = UUID_LENGTH)
    private String sessionId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "TOKEN_TYPE", nullable = false)
    private TokenType tokenType;

    @NotNull(message = "Revoked status is required")
    @Column(name = "REVOKED", nullable = false)
    @Builder.Default
    private Boolean revoked = Boolean.FALSE;

    @NotNull
    @Column(name = "CREATED_AT", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @NotNull
    @Column(name = "EXPIRES_AT", nullable = false)
    private Instant expiresAt;

    @Column(name = "LAST_USED_AT")
    private Instant lastUsedAt;

    @Column(name = "IP_ADDRESS", length = IP_ADDRESS_MAX_LENGTH)
    private String ipAddress;

    @Column(name = "USER_AGENT", length = USER_AGENT_MAX_LENGTH)
    private String userAgent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(Instant.now());
    }

    public boolean isValid() {
        return !revoked && !isExpired();
    }
}
