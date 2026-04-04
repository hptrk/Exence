package com.exence.finance.modules.exchangerate.client;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FrankfurterRateResponse(LocalDate date, SupportedCurrency quote, BigDecimal rate) {}
