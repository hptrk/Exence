package com.exence.finance.modules.transaction.scheduler;

import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.transaction.repository.RecurringTransactionRepository;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import com.exence.finance.modules.transaction.service.impl.RecurringTransactionServiceImpl;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionScheduler {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final ExchangeRateService exchangeRateService;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "${exence.recurring.cron}")
    public void processRecurringTransactions() {
        LocalDate today = LocalDate.now();
        List<RecurringTransaction> dueItems = recurringTransactionRepository.findAllDue(today);

        log.info("Recurring transaction job started - {} due items for date {}", dueItems.size(), today);

        int generated = 0;
        int skipped = 0;
        for (RecurringTransaction rt : dueItems) {
            try {
                boolean wasCreated = processOne(rt, today);
                if (wasCreated) {
                    generated++;
                } else {
                    skipped++;
                }
            } catch (Exception e) {
                log.error("Failed to process recurring transaction id={}: {}", rt.getId(), e.getMessage(), e);
            }
        }

        log.info("Recurring transaction job completed - generated: {}, skipped (duplicate): {}", generated, skipped);
    }

    @WriteTransactional
    public boolean processOne(RecurringTransaction rt, LocalDate executionDate) {
        boolean alreadyExists = transactionRepository.existsByRecurringTransactionAndDate(rt.getId(), executionDate);

        if (!alreadyExists) {
            Transaction transaction = buildTransaction(rt, executionDate);
            transactionRepository.save(transaction);
            eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
            log.debug("Generated transaction for recurring id={}, date={}", rt.getId(), executionDate);
        } else {
            log.warn("Skipping duplicate transaction for recurring id={}, date={}", rt.getId(), executionDate);
        }

        rt.setCurrentOccurrences(rt.getCurrentOccurrences() + 1);
        rt.setNextExecutionDate(RecurringTransactionServiceImpl.calculateNextExecutionDate(rt, executionDate));
        checkAndUpdateEndCondition(rt);
        recurringTransactionRepository.save(rt);

        return !alreadyExists;
    }

    private Transaction buildTransaction(RecurringTransaction rt, LocalDate executionDate) {
        SupportedCurrency baseCurrency = userSettingsRepository
                .findBaseCurrencyByUserId(rt.getUser().getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Settings not found for user " + rt.getUser().getId()));

        SupportedCurrency currency = rt.getCurrency();

        BigDecimal exchangeRate;
        BigDecimal baseCurrencyAmount;

        if (currency == baseCurrency) {
            exchangeRate = BigDecimal.ONE;
            baseCurrencyAmount = rt.getAmount();
        } else {
            exchangeRate = exchangeRateService.getRate(currency, baseCurrency, executionDate);
            baseCurrencyAmount = exchangeRateService.calculateBaseCurrencyAmount(
                    rt.getAmount(), currency, executionDate, exchangeRate);
        }

        return Transaction.builder()
                .title(rt.getTitle())
                .note(rt.getNote())
                .date(executionDate)
                .amount(rt.getAmount())
                .type(rt.getType())
                .currency(currency)
                .exchangeRate(exchangeRate)
                .baseCurrencyAmount(baseCurrencyAmount)
                .createdByRecurringJob(true)
                .recurringTransaction(rt)
                .category(rt.getCategory())
                .user(rt.getUser())
                .build();
    }

    private void checkAndUpdateEndCondition(RecurringTransaction rt) {
        if (rt.getEndCondition() == EndCondition.UNTIL_DATE
                && rt.getEndDate() != null
                && !rt.getNextExecutionDate().isBefore(rt.getEndDate())
                && !rt.getNextExecutionDate().isEqual(rt.getEndDate())) {
            rt.setActive(false);
            log.info("Recurring transaction id={} deactivated: end date {} reached", rt.getId(), rt.getEndDate());
        } else if (rt.getEndCondition() == EndCondition.AFTER_OCCURRENCES
                && rt.getMaxOccurrences() != null
                && rt.getCurrentOccurrences() >= rt.getMaxOccurrences()) {
            rt.setActive(false);
            log.info(
                    "Recurring transaction id={} deactivated: max occurrences {} reached",
                    rt.getId(),
                    rt.getMaxOccurrences());
        }
    }
}
