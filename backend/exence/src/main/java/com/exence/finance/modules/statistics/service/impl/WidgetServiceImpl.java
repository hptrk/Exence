package com.exence.finance.modules.statistics.service.impl;

import com.exence.finance.common.exception.WidgetNotFoundException;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetDTO;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;
import com.exence.finance.modules.statistics.entity.Widget;
import com.exence.finance.modules.statistics.mapper.WidgetMapper;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.statistics.repository.WidgetRepository;
import com.exence.finance.modules.statistics.service.WidgetService;
import com.exence.finance.modules.statistics.service.provider.WidgetDataProvider;
import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WidgetServiceImpl implements WidgetService {

    private final WidgetMapper widgetMapper;
    private final WidgetRepository widgetRepository;
    private final StatisticsRepository statisticsRepository;
    private final UserService userService;
    private final List<WidgetDataProvider> providers;

    private Map<WidgetType, WidgetDataProvider> providerMap;

    @PostConstruct
    private void init() {
        this.providerMap = providers.stream()
                .collect(Collectors.toUnmodifiableMap(WidgetDataProvider::getSupportedType, Function.identity()));
    }

    @Override
    public WidgetLayoutResponse getLayout() {
        List<Widget> widgets = widgetRepository.findAllWidgets();

        return new WidgetLayoutResponse(
                widgetMapper.mapToStatCardDTOList(
                        widgets.stream().filter(w -> w.getType().isStatCard()).toList()),
                widgetMapper.mapToChartDTOList(
                        widgets.stream().filter(w -> w.getType().isGraph()).toList()));
    }

    @Override
    @Transactional
    public WidgetLayoutResponse createWidget(WidgetDTO widgetDTO) {
        Widget widget = widgetMapper.mapToWidget(widgetDTO);
        widget.setUser(userService.getCurrentUser());

        widgetRepository.save(widget);

        return getLayout();
    }

    @Override
    @Transactional
    public WidgetLayoutResponse updateLayout(UpdateLayoutRequest request) {
        Map<Long, Widget> existingWidgets = widgetRepository.findAllWidgets().stream()
                .collect(Collectors.toMap(Widget::getId, Function.identity()));

        Set<Long> incomingIds = new HashSet<>();

        if (request.statCards() != null) {
            request.statCards().forEach(item -> {
                Widget widget = existingWidgets.get(item.id());
                if (widget == null) {
                    throw new WidgetNotFoundException("Widget not found: " + item.id());
                }
                widget.setDisplayOrder(item.displayOrder());
                incomingIds.add(item.id());
            });
        }

        if (request.charts() != null) {
            request.charts().forEach(item -> {
                Widget widget = existingWidgets.get(item.id());
                if (widget == null) {
                    throw new WidgetNotFoundException("Widget not found: " + item.id());
                }
                widget.setX(item.x());
                widget.setY(item.y());
                widget.setCols(item.cols());
                widget.setRows(item.rows());
                incomingIds.add(item.id());
            });
        }

        List<Long> idsToDelete = existingWidgets.keySet().stream()
                .filter(id -> !incomingIds.contains(id))
                .toList();

        if (!idsToDelete.isEmpty()) {
            widgetRepository.deleteAllByIdInBatch(idsToDelete);
        }

        return getLayout();
    }

    @Override
    public WidgetDataResponse getWidgetData(Long widgetId, Timeframe timeframe) {
        Widget widget = widgetRepository
                .find(widgetId)
                .orElseThrow(() -> new WidgetNotFoundException("Widget not found: " + widgetId));

        Timeframe resolvedTimeframe = resolveTimeframe(timeframe, widget);

        Instant startDate = resolvedTimeframe.toStartDate();
        if (resolvedTimeframe == Timeframe.ALL_TIME) {
            Instant earliest = statisticsRepository.findEarliestStatDate();
            if (earliest != null) {
                startDate = earliest;
            }
        }

        WidgetRequest request = new WidgetRequest(startDate, Instant.now(), resolvedTimeframe, widget.getSettings());
        WidgetDataProvider provider = providerMap.get(widget.getType());
        if (provider == null) {
            log.error("No data provider for widget: {}, type: {}", widget.getId(), widget.getType());
            throw new UnsupportedOperationException("No data provider for widget type: " + widget.getType());
        }

        WidgetDataPayload payload = provider.getData(request);
        return new WidgetDataResponse(widget.getId(), widget.getType(), payload);
    }

    private Timeframe resolveTimeframe(Timeframe queryParamTimeframe, Widget widget) {
        if (widget.getType().isYtdOnly()) {
            return Timeframe.YTD;
        }
        if (queryParamTimeframe != null) {
            return queryParamTimeframe;
        }
        if (widget.getTimeframe() != null) {
            return widget.getTimeframe();
        }
        return Timeframe.YTD;
    }
}
