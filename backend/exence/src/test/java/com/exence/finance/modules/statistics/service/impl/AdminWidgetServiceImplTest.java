package com.exence.finance.modules.statistics.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.service.provider.admin.DailyActiveUsersProvider;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class AdminWidgetServiceImplTest {

    @Mock
    private DailyActiveUsersProvider dailyActiveUsersProvider;

    private AdminWidgetServiceImpl service;

    @BeforeEach
    void setUp() {
        given(dailyActiveUsersProvider.getSupportedType()).willReturn(AdminWidgetType.DAILY_ACTIVE_USERS);
        service = new AdminWidgetServiceImpl(List.of(dailyActiveUsersProvider));
        ReflectionTestUtils.invokeMethod(service, "init");
    }

    @Test
    @DisplayName("routes to provider and returns response for known widget type")
    void getWidgetData_withKnownType() {
        // given
        SeriesPayload payload = new SeriesPayload(null, List.of());
        given(dailyActiveUsersProvider.getData(any())).willReturn(payload);

        // when
        AdminWidgetDataResponse response =
                service.getWidgetData(AdminWidgetType.DAILY_ACTIVE_USERS, Timeframe.ONE_MONTH);

        // then
        assertThat(response.payload()).isEqualTo(payload);
    }

    @Test
    @DisplayName("defaults to ALL_TIME timeframe when timeframe is null")
    void getWidgetData_withNullTimeframe() {
        // given
        SeriesPayload payload = new SeriesPayload(null, List.of());
        given(dailyActiveUsersProvider.getData(any())).willReturn(payload);

        // when
        AdminWidgetDataResponse response = service.getWidgetData(AdminWidgetType.DAILY_ACTIVE_USERS, null);

        // then
        assertThat(response.payload()).isEqualTo(payload);
    }

    @Test
    @DisplayName("throws ADMIN_WIDGET_TYPE_NOT_SUPPORTED for unknown widget type")
    void getWidgetData_withUnknownType() {
        assertThatThrownBy(() -> service.getWidgetData(AdminWidgetType.MONTHLY_ACTIVE_USERS, Timeframe.ONE_MONTH))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.ADMIN_WIDGET_TYPE_NOT_SUPPORTED);
    }
}
