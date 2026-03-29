package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.ReentrantLock;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Service
@RequiredArgsConstructor
public class MaterializedViewRefreshService {

    private static final String REFRESH_SQL = "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_category_stat";

    private final JdbcClient jdbcClient;

    private final ReentrantLock refreshLock = new ReentrantLock();
    private final AtomicBoolean refreshPending = new AtomicBoolean(false);

    @Async
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.debug("Application started, triggering initial materialized view refresh...");
        executeRefresh();
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onRefreshRequired(MaterializedViewRefreshEvent event) {
        executeRefresh();
    }

    private void executeRefresh() {
        refreshPending.set(true);

        if (refreshLock.tryLock()) {
            try {
                // if another thread requested refresh while we were refreshing, we need to do it again
                while (refreshPending.compareAndSet(true, false)) {
                    log.debug("Refreshing materialized view mv_daily_category_stat");
                    jdbcClient.sql(REFRESH_SQL).update();
                    log.debug("Materialized view mv_daily_category_stat refreshed successfully");
                }
            } catch (Exception e) {
                log.error("Failed to refresh materialized view mv_daily_category_stat", e);
            } finally {
                refreshLock.unlock();
            }
        } else {
            log.debug("Materialized view refresh already in progress, request coalesced");
        }
    }
}
