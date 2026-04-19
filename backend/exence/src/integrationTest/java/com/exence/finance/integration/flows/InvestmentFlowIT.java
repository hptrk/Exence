package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.investment.enums.InvestmentType;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 9 — Investments
 *
 * <p>FLOW-INV-01: Building investment portfolio and grouped view
 */
class InvestmentFlowIT extends BaseFlowIT {

    @Test
    void flowInv01_portfolioAndGroupedView() {
        AuthContext user = authActor().registerVerifiedUser();

        // 2-5. Create 4 investments (2 Bitcoin, 1 Apple, 1 Gold)
        var btc1 = investmentActor().createInvestment(user,
                ITFixtures.investment()
                        .asset("Bitcoin").type(InvestmentType.CRYPTO)
                        .amount(new BigDecimal("0.5")).currency(SupportedCurrency.USD)
                        .purchaseDate(LocalDate.now()).build());

        var btc2 = investmentActor().createInvestment(user,
                ITFixtures.investment()
                        .asset("Bitcoin").type(InvestmentType.CRYPTO)
                        .amount(new BigDecimal("0.3")).currency(SupportedCurrency.USD)
                        .purchaseDate(LocalDate.now()).build());

        var apple = investmentActor().createInvestment(user,
                ITFixtures.investment()
                        .asset("Apple Inc.").type(InvestmentType.STOCK)
                        .amount(new BigDecimal("10")).currency(SupportedCurrency.USD)
                        .purchaseDate(LocalDate.now()).build());

        investmentActor().createInvestment(user,
                ITFixtures.investment()
                        .asset("Gold").type(InvestmentType.METAL)
                        .amount(new BigDecimal("50")).currency(SupportedCurrency.EUR)
                        .purchaseDate(LocalDate.now()).build());

        // 6. List all → 4 investments
        assertThat(investmentActor().listInvestments(user)).hasSize(4);

        // 7. Grouped → 3 groups (Bitcoin, Apple, Gold), Bitcoin aggregated
        var grouped = investmentActor().listGrouped(user);
        assertThat(grouped).hasSize(3);
        var bitcoinGroup = grouped.stream()
                .filter(g -> "Bitcoin".equals(g.name()))
                .findFirst()
                .orElseThrow();
        assertThat(bitcoinGroup.purchasesCount()).isEqualTo(2);

        // 8. PATCH btc1 note → 200
        var patched = investmentActor().patchInvestment(user, btc1.id(),
                ITFixtures.investmentPatch().asset("Bitcoin").note("Long-term hold strategy").build());
        assertThat(patched.note()).isEqualTo("Long-term hold strategy");

        // 9. DELETE Apple investment → 204
        investmentActor().deleteInvestment(user, apple.id());

        // 10. Grouped → 2 groups (Bitcoin, Gold)
        assertThat(investmentActor().listGrouped(user)).hasSize(2);

        // 11. Widget INVESTMENT_SUMMARY → 200
        investmentActor().getWidgetDataRaw(user, "INVESTMENT_SUMMARY").statusCode(200);

        // 12. Invalid widget type → 400 INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED
        investmentActor().getWidgetDataRaw(user, "INVALID_TYPE")
                .statusCode(400)
                .body("code", equalTo("investment-widget-type-not-supported"));
    }
}
