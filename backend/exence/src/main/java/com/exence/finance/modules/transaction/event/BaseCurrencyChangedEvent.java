package com.exence.finance.modules.transaction.event;

import com.exence.finance.common.dto.SupportedCurrency;

public record BaseCurrencyChangedEvent(SupportedCurrency newBaseCurrency) {}
