package com.exence.finance.modules.transaction.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.Instant;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false, exclude = { "" })
@ToString(callSuper = true, exclude = { "" })
@JsonIdentityInfo(generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = TransactionDTO.class)
public class TransactionDTO {
    private Long id;

    private String title;

    private Instant date;

    private BigDecimal amount;

    private TransactionType type;

    private Boolean recurring;

    private Long categoryId;
}
