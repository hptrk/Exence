package com.exence.finance.modules.statistics.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import com.exence.finance.modules.statistics.service.DebtWidgetService;
import com.exence.finance.modules.statistics.service.provider.debt.DebtWidgetDataProvider;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DebtWidgetServiceImpl implements DebtWidgetService {

    private final List<DebtWidgetDataProvider> providers;

    private Map<DebtWidgetType, DebtWidgetDataProvider> providerMap;

    @PostConstruct
    private void init() {
        this.providerMap = Map.copyOf(providers.stream()
                .collect(Collectors.toMap(DebtWidgetDataProvider::getSupportedType, Function.identity())));
    }

    @Override
    @ReadTransactional
    public DebtWidgetDataResponse getWidgetData(DebtWidgetType type) {
        DebtWidgetDataProvider provider = providerMap.get(type);
        if (provider == null) {
            log.error("No data provider for debt widget type: {}", type);
            throw new ExenceException(ErrorCode.DEBT_WIDGET_TYPE_NOT_SUPPORTED);
        }
        WidgetDataPayload payload = provider.getData();
        return new DebtWidgetDataResponse(type, payload);
    }
}
