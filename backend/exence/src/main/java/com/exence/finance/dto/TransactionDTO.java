package com.exence.finance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotNull(message = "Date is mandatory")
    private LocalDate date;

    @NotNull(message = "Amount is mandatory")
    private Double amount;

    @NotBlank(message = "Type is mandatory")
    private String type;

    @NotNull(message = "Category ID is mandatory")
    private Long categoryId;
//    @NotNull(message = "User ID is mandatory")
//    private Long userId;
}
