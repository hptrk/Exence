package com.exence.finance.modules.statistics.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import com.exence.finance.modules.statistics.service.InvestmentWidgetService;
import com.exence.finance.modules.statistics.service.provider.investment.InvestmentWidgetDataProvider;
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
public class InvestmentWidgetServiceImpl implements InvestmentWidgetService {

    private final List<InvestmentWidgetDataProvider> providers;

    private Map<InvestmentWidgetType, InvestmentWidgetDataProvider> providerMap;

    @PostConstruct
    private void init() {
        this.providerMap = Map.copyOf(providers.stream()
                .collect(Collectors.toMap(InvestmentWidgetDataProvider::getSupportedType, Function.identity())));
    }

    @Override
    @ReadTransactional
    public InvestmentWidgetDataResponse getWidgetData(InvestmentWidgetType type) {
        InvestmentWidgetDataProvider provider = providerMap.get(type);
        if (provider == null) {
            log.error("No data provider for investment widget type: {}", type);
            throw new ExenceException(ErrorCode.INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED);
        }
        WidgetDataPayload payload = provider.getData();
        return new InvestmentWidgetDataResponse(type, payload);
    }
}
