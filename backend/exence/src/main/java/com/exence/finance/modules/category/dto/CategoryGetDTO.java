package com.exence.finance.modules.category.dto;

public record CategoryGetDTO(Long id, String name, MaterialIcon icon, String color, CategoryType type, String note) {}
