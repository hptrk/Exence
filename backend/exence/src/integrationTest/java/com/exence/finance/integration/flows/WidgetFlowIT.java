package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.statistics.dto.Timeframe;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 10 — Statistics & Widgets
 *
 * <p>FLOW-WIDGET-01: Dashboard widget layout and data handling
 * <p>FLOW-WIDGET-02: Email verification barrier in Statistics module
 */
class WidgetFlowIT extends BaseFlowIT {

    @Test
    void flowWidget01_dashboardLayoutAndData() {
        // 1. Register and verify (default widgets created during registration)
        AuthContext user = authActor().registerVerifiedUser();

        // 2. GET /statistics/widgets/layout → statCards and charts empty
        var layout = widgetActor().getLayout(user);
        assertThat(layout).isNotNull();
        assertThat(layout.statCards().size()).isEqualTo(0);
        assertThat(layout.charts().size()).isEqualTo(0);

        // 3. GET dashboard balance trend → 200
        var widget = widgetActor().getDashboardBalanceTrend(user, Timeframe.ONE_MONTH);

        // 4-5. Widget data with different timeframes (use dashboard widget)
        long widgetId = widget.widgetId();
        widgetActor().getWidgetData(user, widgetId, Timeframe.ONE_MONTH);
        widgetActor().getWidgetData(user, widgetId, Timeframe.ONE_YEAR);

        // 6. Non-existent widget ID → 404 WIDGET_NOT_FOUND
        widgetActor().getWidgetDataRaw(user, 999_999L).statusCode(404).body("code", equalTo("widget-not-found"));
    }

    @Test
    void flowWidget02_unverifiedUserCanAccessWidgets() {
        // 1. Register WITHOUT verification
        AuthContext unverified = authActor().registerUser();

        // 2. GET /statistics/widgets/layout → 200 (widgets do not require email verification)
        widgetActor().getLayoutRaw(unverified).statusCode(200);

        // 3. GET dashboard → 200
        widgetActor().getDashboardRaw(unverified).statusCode(200);
    }
}
