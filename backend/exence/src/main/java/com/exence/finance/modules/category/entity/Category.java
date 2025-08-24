package com.exence.finance.modules.category.entity;

import com.exence.finance.common.entity.BaseAuditableEntity;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.List;

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

    @NotBlank
    @Size(min = 1, max = 25)
    @Column(name = "NAME", nullable = false, length = 25)
    private String name;

    @Size(max = 1)
    @Column(name = "EMOJI", length = 4)
    private String emoji;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Transaction> transactions;
}
