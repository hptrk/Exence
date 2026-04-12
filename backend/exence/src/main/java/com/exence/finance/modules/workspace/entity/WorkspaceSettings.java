package com.exence.finance.modules.workspace.entity;

import com.exence.finance.common.dto.SupportedCurrency;
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
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "workspace_settings")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"workspace"})
@ToString(exclude = {"workspace"})
public class WorkspaceSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "workspace_settings_id_seq")
    @SequenceGenerator(
            name = "workspace_settings_id_seq",
            sequenceName = "workspace_settings_id_seq",
            allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, unique = true)
    private Workspace workspace;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "base_currency", nullable = false)
    private SupportedCurrency baseCurrency;

    @NotNull
    @Column(name = "show_base_currency", nullable = false)
    private Boolean showBaseCurrency;
}
