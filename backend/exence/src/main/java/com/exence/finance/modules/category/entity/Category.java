package com.exence.finance.modules.category.entity;

import com.exence.finance.common.entity.BaseAuditableEntity;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.transaction.entity.Transaction;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.List;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_EMOJI_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = { "user", "transactions" })
@ToString(callSuper = true, exclude = { "user", "transactions" })
@Table(name = "CATEGORY", uniqueConstraints = { @UniqueConstraint(columnNames = "ID") })
@SequenceGenerator(name = "category_gen", sequenceName = "category_id_seq", allocationSize = 1)
public class Category extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_gen")
    private Long id;

    @NotNull
    @Column(name = "NAME", nullable = false, length = CATEGORY_NAME_MAX_LENGTH)
    private String name;

    @Column(name = "EMOJI", length = CATEGORY_EMOJI_MAX_LENGTH)
    private String emoji;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Transaction> transactions;
}
