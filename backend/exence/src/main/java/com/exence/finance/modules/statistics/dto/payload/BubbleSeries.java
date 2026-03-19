package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record BubbleSeries(String name, List<BubblePoint> data, String color) {}
