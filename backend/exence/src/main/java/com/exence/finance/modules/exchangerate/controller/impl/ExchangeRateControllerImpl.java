package com.exence.finance.modules.exchangerate.controller.impl;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.exchangerate.controller.ExchangeRateController;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/api/exchange-rates")
public class ExchangeRateControllerImpl implements ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    @Override
    @GetMapping()
    public ResponseEntity<BigDecimal> getRate(
            @RequestParam SupportedCurrency from, @RequestParam SupportedCurrency to, @RequestParam LocalDate date) {
        BigDecimal rate = exchangeRateService.getRate(from, to, date);
        return ResponseFactory.ok(rate);
    }
}
