package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.investment.enums.InvestmentType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public final class InvestmentTestFixtures {

    private InvestmentTestFixtures() {}

    public static InvestmentCreateDTO createRequest() {
        return new InvestmentCreateDTO(
                "Bitcoin",
                LocalDate.of(2026, 1, 15),
                InvestmentType.CRYPTO,
                new BigDecimal("500000.00"),
                SupportedCurrency.HUF,
                null);
    }

    public static InvestmentPatchDTO patchRequest() {
        return new InvestmentPatchDTO("Ethereum", null, InvestmentType.CRYPTO, new BigDecimal("750000.00"), null);
    }

    public static InvestmentGetDTO getDTO() {
        return new InvestmentGetDTO(
                1L,
                "Bitcoin",
                LocalDate.of(2026, 1, 15),
                InvestmentType.CRYPTO,
                new BigDecimal("500000.00"),
                SupportedCurrency.HUF,
                new BigDecimal("1250.00"),
                null);
    }

    public static InvestmentGroupDTO groupDTO() {
        return new InvestmentGroupDTO(
                "Bitcoin", 30L, new BigDecimal("1250.00"), InvestmentType.CRYPTO, 1, List.of(getDTO()));
    }
}
