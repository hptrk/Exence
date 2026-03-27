package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;

import com.exence.finance.modules.statistics.dto.WidgetType;

public sealed interface WidgetDataPayload
        permits BoxplotPayload,
                BubblePayload,
                DistributionPayload,
                GaugePayload,
                SankeyPayload,
                SeriesPayload,
                SlopePayload,
                StatCardPayload,
                LeaderboardPayload,
                SummaryPayload {
    WidgetType type();
}
