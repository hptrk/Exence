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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = { "user" })
@ToString(callSuper = true, exclude = { "user" })
@Table(name = "TOKEN", uniqueConstraints = { @UniqueConstraint(columnNames = "ID") })
@SequenceGenerator(name = "default_gen", sequenceName = "TOKEN_ID_SEQ", allocationSize = 1)
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "default_gen")
    private Long id;

    @NotBlank
    @Column(name = "TOKEN_VALUE", nullable = false, unique = true, length = 1000)
    private String token;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "TOKEN_TYPE", nullable = false, length = 20)
    @Builder.Default
    private TokenType tokenType = TokenType.BEARER;

    @NotNull(message = "Revoked status is required")
    @Column(name = "REVOKED", nullable = false)
    @Builder.Default
    private Boolean revoked = Boolean.FALSE;

    @NotNull
    @Column(name = "EXPIRED", nullable = false)
    @Builder.Default
    private Boolean expired = Boolean.FALSE;

    @Column(name = "EXPIRES_AT")
    private Instant expiresAt;

    @Column(name = "LAST_USED_AT")
    private Instant lastUsedAt;

    @Size(max = 45)
    @Column(name = "IP_ADDRESS", length = 45)
    private String ipAddress;

    @Size(max = 500)
    @Column(name = "USER_AGENT", length = 500)
    private String userAgent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;
}
