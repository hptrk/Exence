package com.exence.finance.modules.auth.entity;

import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.transaction.entity.Transaction;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import static com.exence.finance.common.util.ValidationConstants.EMAIL_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.USERNAME_MAX_LENGTH;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = { "transactions", "categories", "tokens" })
@ToString(callSuper = true, exclude = { "transactions", "categories", "tokens", "password" })
@Table(name = "_user",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_email", columnNames = "EMAIL"),
                @UniqueConstraint(name = "uk_user_username", columnNames = "USERNAME")
        },
        indexes = {
                @Index(name = "idx_user_email", columnList = "EMAIL"),
                @Index(name = "idx_user_username", columnList = "USERNAME"),
        })
@SequenceGenerator(name = "user_gen", sequenceName = "user_id_seq", allocationSize = 1)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_gen")
    private Long id;

    @NotNull
    @Column(name = "USERNAME", nullable = false, length = USERNAME_MAX_LENGTH)
    private String username;

    @NotNull
    @Column(name = "EMAIL", nullable = false, unique = true, length = EMAIL_MAX_LENGTH)
    private String email;

    @NotNull
    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "EMAIL_VERIFIED", nullable = false)
    @Builder.Default
    private Boolean emailVerified = Boolean.FALSE;

    @Column(name = "LAST_LOGIN_AT")
    private Instant lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Category> categories;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<Token> tokens;

    // Spring Security UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getUsername() {
        return email; // Use email as the username for Spring Security
    }

    public String getDisplayUsername() {
        return username; // Actual username for display purposes
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
