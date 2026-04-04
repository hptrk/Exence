package com.exence.finance.modules.statistics.dto.result;

import com.exence.finance.modules.transaction.dto.TransactionType;

public record TypeCountResult(TransactionType type, long count) {}
