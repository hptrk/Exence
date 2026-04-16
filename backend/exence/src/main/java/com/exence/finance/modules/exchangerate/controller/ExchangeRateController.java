package com.exence.finance.modules.exchangerate.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.http.ResponseEntity;

@Tag(name = "Exchange Rates", description = "Currency exchange rate lookups")
public interface ExchangeRateController {

    @ExenceOpenApi(
            summary = "Get exchange rate for a specific date",
            description = "Returns the exchange rate from the `from` currency to the `to` currency on the given date."
                    + " Rates are sourced from the Frankfurter API and cached in the database. If the"
                    + " rate is not cached, it is fetched from the external service. Returns 1 when both"
                    + " currencies are the same.",
            successStatus = 200,
            successDescription = "Exchange rate returned as a decimal value.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<BigDecimal> getRate(SupportedCurrency fromCurrency, SupportedCurrency toCurrency, LocalDate date);
}
