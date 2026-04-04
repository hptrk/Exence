package com.exence.finance.modules.category.dto;

import java.math.BigDecimal;

public record CategorySummaryResponse(Long id, String name, String icon, String color, BigDecimal totalAmount) {}
