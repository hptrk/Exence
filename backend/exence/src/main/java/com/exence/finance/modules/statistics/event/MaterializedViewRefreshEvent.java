package com.exence.finance.modules.statistics.event;

/**
 * Marker event published after a transaction or category mutation commits,
 * signaling that the mv_daily_category_stat materialized view needs refresh.
 */
public record MaterializedViewRefreshEvent() {}
