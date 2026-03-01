package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;

public record DistributionItem(String name, BigDecimal amount, String color) {}
