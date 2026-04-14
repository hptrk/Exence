package com.exence.finance.modules.category.entity;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_COLOR_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NOTE_MAX_LENGTH;

import com.exence.finance.common.entity.BaseWorkspaceEntity;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.transaction.entity.Transaction;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.javers.core.metamodel.annotation.DiffIgnore;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(
        callSuper = false,
        exclude = {"transactions"})
@ToString(
        callSuper = true,
        exclude = {"transactions"})
@Table(name = "category")
@Filter(name = "workspaceFilter", condition = "workspace_id = :workspaceId")
public class Category extends BaseWorkspaceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_id_seq")
    @SequenceGenerator(name = "category_id_seq", sequenceName = "category_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false, length = CATEGORY_NAME_MAX_LENGTH)
    private String name;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "icon", nullable = false)
    private MaterialIcon icon;

    @NotNull
    @Column(name = "color", nullable = false, length = CATEGORY_COLOR_MAX_LENGTH)
    private String color;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", nullable = false)
    private CategoryType type;

    @Column(name = "note", length = CATEGORY_NOTE_MAX_LENGTH)
    private String note;

    @DiffIgnore
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Transaction> transactions;
}
