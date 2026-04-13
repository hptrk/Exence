package com.exence.finance.modules.investment.repository;

import com.exence.finance.modules.investment.entity.Investment;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {

    @Query("SELECT i FROM Investment i WHERE i.id = :id")
    Optional<Investment> find(Long id);

    @Query("SELECT i FROM Investment i")
    List<Investment> findAllWorkspaceFiltered();

    @Query("SELECT COALESCE(SUM(i.baseCurrencyAmount), 0) FROM Investment i WHERE i.workspace.id = :workspaceId")
    BigDecimal sumBaseCurrencyAmountByWorkspaceId(Long workspaceId);

    @Query("SELECT COUNT(DISTINCT i.asset) FROM Investment i WHERE i.workspace.id = :workspaceId")
    long countDistinctAssetsByWorkspaceId(Long workspaceId);
}
