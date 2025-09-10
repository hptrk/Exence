package com.exence.finance.modules.transaction.repository;

import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import com.exence.finance.modules.transaction.entity.Transaction;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.id = :id")
    Optional<Transaction> find(@Param("id") Long id);

    @Query("SELECT t FROM Transaction t WHERE " +
            "(:#{#filter.keyword} IS NULL OR :#{#filter.keyword} = '' OR " +
            "LOWER(t.title) LIKE %:#{#filter.keyword?.toLowerCase()}% OR " +
            "LOWER(t.note) LIKE %:#{#filter.keyword?.toLowerCase()}%) " +
            "AND (:#{#filter.categoryId} IS NULL OR t.category.id = :#{#filter.categoryId}) " +
            "AND (:#{#filter.type} IS NULL OR t.type = :#{#filter.type}) " +
            "AND (:#{#filter.dateFrom} IS NULL OR t.date >= :#{#filter.dateFrom}) " +
            "AND (:#{#filter.dateTo} IS NULL OR t.date <= :#{#filter.dateTo}) " +
            "AND (:#{#filter.amountFrom} IS NULL OR t.amount >= :#{#filter.amountFrom}) " +
            "AND (:#{#filter.amountTo} IS NULL OR t.amount <= :#{#filter.amountTo}) " +
            "AND (:#{#filter.recurring} IS NULL OR t.recurring = :#{#filter.recurring}) " +
            "ORDER BY t.date DESC")
    Page<Transaction> findWithFilter(
            @Param("filter") TransactionFilter filter,
            Pageable pageable
    );
}
