package com.exence.finance.modules.auth.entity;

import static com.exence.finance.common.util.ValidationConstants.LANGUAGE_CODE_LENGTH;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.dto.Theme;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(
        callSuper = false,
        exclude = {"user"})
@ToString(
        callSuper = true,
        exclude = {"user"})
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_settings_id_seq")
    @SequenceGenerator(name = "user_settings_id_seq", sequenceName = "user_settings_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotNull
    @Column(name = "language", nullable = false, length = LANGUAGE_CODE_LENGTH)
    private String language;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "primary_theme", nullable = false)
    private Theme primaryTheme;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "secondary_theme", nullable = false)
    private Theme secondaryTheme;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "base_currency", nullable = false)
    private SupportedCurrency baseCurrency;

    @NotNull
    @Column(name = "show_base_currency", nullable = false)
    private Boolean showBaseCurrency;
}
