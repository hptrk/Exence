package com.exence.finance.modules.category.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorySummaryResponse {
    private Long id;
    private String name;
    private String icon;
    private String color;
    private BigDecimal totalAmount;
}
