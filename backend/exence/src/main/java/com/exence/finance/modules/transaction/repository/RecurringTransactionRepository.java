package com.exence.finance.modules.transaction.repository;

import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    @Query("SELECT rt FROM RecurringTransaction rt WHERE rt.id = :id")
    Optional<RecurringTransaction> find(@Param("id") Long id);

    @Query("SELECT rt FROM RecurringTransaction rt")
    Page<RecurringTransaction> findAllUserFiltered(Pageable pageable);

    @Query("SELECT rt FROM RecurringTransaction rt WHERE rt.type = :type")
    Page<RecurringTransaction> findAllUserFilteredByType(@Param("type") TransactionType type, Pageable pageable);

    @Query("SELECT rt FROM RecurringTransaction rt WHERE rt.active = true AND rt.nextExecutionDate <= :date")
    List<RecurringTransaction> findAllDue(@Param("date") LocalDate date);
}
