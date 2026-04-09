package com.exence.finance.modules.category.dto;

import java.math.BigDecimal;

public record CategoryGetDTO(
        Long id, String name, MaterialIcon icon, String color, CategoryType type, String note, BigDecimal balance) {}
