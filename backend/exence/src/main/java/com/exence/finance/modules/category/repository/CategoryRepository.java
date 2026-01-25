package com.exence.finance.modules.category.repository;

import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import com.exence.finance.modules.category.entity.Category;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE c.id = :id")
    Optional<Category> find(Long id);

    @Query(
            """
        SELECT new com.exence.finance.modules.category.dto.CategorySummaryResponse(
            c.id, c.name, c.emoji, COALESCE(SUM(t.amount), 0)
        )
        FROM Category c
        LEFT JOIN c.transactions t
        WHERE (t.type = 'EXPENSE')
        GROUP BY c.id, c.name, c.emoji
        ORDER BY COALESCE(SUM(t.amount), 0) DESC
        LIMIT 4
    """)
    List<CategorySummaryResponse> findTop4CategoriesByTotalAmount();
}
