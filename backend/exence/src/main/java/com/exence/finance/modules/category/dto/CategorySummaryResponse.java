package com.exence.finance.modules.category.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorySummaryResponse {
    private Long id;
    private String name;
    private String emoji;
    private BigDecimal totalAmount;
}
