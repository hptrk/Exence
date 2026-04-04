package com.exence.finance.modules.statistics.service.impl;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import com.exence.finance.modules.statistics.service.AdminWidgetService;
import com.exence.finance.modules.statistics.service.provider.admin.AdminWidgetDataProvider;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminWidgetServiceImpl implements AdminWidgetService {

    private final List<AdminWidgetDataProvider> providers;

    private Map<AdminWidgetType, AdminWidgetDataProvider> providerMap;

    @PostConstruct
    private void init() {
        this.providerMap = Map.copyOf(providers.stream()
                .collect(Collectors.toMap(AdminWidgetDataProvider::getSupportedType, Function.identity())));
    }

    @Override
    public AdminWidgetDataResponse getWidgetData(AdminWidgetType type, Timeframe timeframe) {
        Timeframe resolvedTimeframe = timeframe != null ? timeframe : Timeframe.ALL_TIME;

        LocalDate startDate = resolvedTimeframe.toStartDate();
        if (startDate == null) {
            startDate = LocalDate.of(2020, 1, 1);
        }

        AdminWidgetRequest request = new AdminWidgetRequest(startDate, LocalDate.now(), resolvedTimeframe);

        AdminWidgetDataProvider provider = providerMap.get(type);
        if (provider == null) {
            log.error("No data provider for admin widget type: {}", type);
            throw new ExenceException(ErrorCode.ADMIN_WIDGET_TYPE_NOT_SUPPORTED);
        }

        WidgetDataPayload payload = provider.getData(request);
        return new AdminWidgetDataResponse(type, payload);
    }
}
