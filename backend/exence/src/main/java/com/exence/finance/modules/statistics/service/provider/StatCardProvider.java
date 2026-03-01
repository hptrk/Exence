package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class StatCardProvider implements WidgetDataProvider {

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.EXAMPLE_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        return null;
    }
}
