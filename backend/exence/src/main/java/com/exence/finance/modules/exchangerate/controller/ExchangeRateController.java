package com.exence.finance.modules.exchangerate.controller;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.http.ResponseEntity;

public interface ExchangeRateController {

    ResponseEntity<BigDecimal> getRate(SupportedCurrency fromCurrency, SupportedCurrency toCurrency, LocalDate date);
}
