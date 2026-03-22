package com.exence.finance.modules.statistics.dto.result;

import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;

public record TypeAmountResult(TransactionType type, BigDecimal totalAmount) {}
