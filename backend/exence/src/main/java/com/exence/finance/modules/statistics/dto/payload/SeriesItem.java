package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record SeriesItem(String name, String type, String color, List<DataPoint> data) {}
