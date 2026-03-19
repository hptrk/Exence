package com.exence.finance.modules.statistics.dto.payload;

public sealed interface WidgetDataPayload
        permits BoxplotPayload,
                BubblePayload,
                DistributionPayload,
                GaugePayload,
                SankeyPayload,
                SeriesPayload,
                SlopePayload,
                StatCardPayload {}
