package com.exence.finance.modules.category.repository;

import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.entity.Category;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE c.id = :id")
    Optional<Category> find(Long id);

    @Query("SELECT c.id FROM Category c WHERE c.id IN :ids")
    Set<Long> findExistingIds(@Param("ids") Collection<Long> ids);

    @Query(
            """
                SELECT new com.exence.finance.modules.category.dto.CategorySummaryResponse(
                    c.id, c.name, CAST(c.icon AS string), c.color, COALESCE(SUM(t.amount), 0)
                )
                FROM Category c
                left JOIN c.transactions t
                WHERE c.type = :type
                    AND (
                    (:type = 'INCOME' AND t.type = 'INCOME') OR
                    (:type IN ('EXPENSE', 'MIXED') AND t.type = 'EXPENSE')
                )
                GROUP BY c.id, c.name, c.icon, c.color
                ORDER BY COALESCE(SUM(t.amount), 0) DESC
                LIMIT 4
            """)
    List<CategorySummaryResponse> findTopCategoriesByTotalAmount(@Param("type") CategoryType type);
}
