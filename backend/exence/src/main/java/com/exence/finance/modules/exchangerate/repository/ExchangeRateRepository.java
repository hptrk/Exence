package com.exence.finance.modules.exchangerate.repository;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.exchangerate.entity.ExchangeRate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {

    @Query("SELECT e.rateFromEur FROM ExchangeRate e " + "WHERE e.rateDate = :rateDate " + "AND e.currency = :currency")
    Optional<BigDecimal> findRateByRateDateAndCurrency(LocalDate rateDate, SupportedCurrency currency);

    List<ExchangeRate> findByRateDateBetweenAndCurrencyIn(
            LocalDate startDate, LocalDate endDate, Set<SupportedCurrency> currencies);

    boolean existsByRateDateAndCurrency(LocalDate rateDate, SupportedCurrency currency);
}
