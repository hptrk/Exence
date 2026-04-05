package com.exence.finance.modules.statistics.dto.result;

import com.exence.finance.common.dto.SupportedCurrency;

public record CurrencyCountResult(SupportedCurrency currency, long count) {}
