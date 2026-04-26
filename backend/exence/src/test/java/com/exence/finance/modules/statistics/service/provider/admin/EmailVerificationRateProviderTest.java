package com.exence.finance.modules.statistics.service.provider.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmailVerificationRateProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private AdminStatisticsQueryService adminStatisticsQueryService;

    @InjectMocks
    private EmailVerificationRateProvider provider;

    @Test
    @DisplayName("returns EMAIL_VERIFICATION_RATE as the supported widget type")
    void getSupportedType_returnsEmailVerificationRate() {
        assertThat(provider.getSupportedType()).isEqualTo(AdminWidgetType.EMAIL_VERIFICATION_RATE);
    }

    @Test
    @DisplayName("returns correct verification percentage when users are present")
    void getData_withUsers() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.countTotalUsers()).willReturn(100L);
        given(adminStatisticsQueryService.countVerifiedUsers()).willReturn(80L);
        given(i18n.get(anyString())).willReturn("of users verified");

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(AdminWidgetType.EMAIL_VERIFICATION_RATE);
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("80.0"));
        assertThat(result.unit()).isEqualTo("%");
    }

    @Test
    @DisplayName("returns zero percentage when no users exist")
    void getData_withNoUsers() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.countTotalUsers()).willReturn(0L);
        given(adminStatisticsQueryService.countVerifiedUsers()).willReturn(0L);
        given(i18n.get(anyString())).willReturn("of users verified");

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
