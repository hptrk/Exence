package com.exence.finance.modules.statistics.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.statistics.controller.WidgetController;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;
import com.exence.finance.modules.statistics.service.WidgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics/widgets")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class WidgetControllerImpl implements WidgetController {

    private final WidgetService widgetService;

    @Override
    @GetMapping("/layout")
    public ResponseEntity<WidgetLayoutResponse> getLayout() {
        return ResponseFactory.ok(widgetService.getLayout());
    }

    @Override
    @GetMapping("/{widgetId}/data")
    public ResponseEntity<WidgetDataResponse> getWidgetData(
            @PathVariable Long widgetId, @RequestParam(required = false) Timeframe timeframe) {
        return ResponseFactory.ok(widgetService.getWidgetData(widgetId, timeframe));
    }

    @Override
    @GetMapping("/dashboard")
    public ResponseEntity<WidgetDataResponse> getDashboardBalanceTrend(
            @RequestParam(required = false) Timeframe timeframe) {
        return ResponseFactory.ok(widgetService.getDashboardBalanceTrend(timeframe));
    }

    @Override
    @PostMapping
    public ResponseEntity<WidgetLayoutResponse> createWidget(@Valid @RequestBody WidgetCreateDTO widgetCreateDTO) {
        return ResponseFactory.ok(widgetService.createWidget(widgetCreateDTO));
    }

    @Override
    @PutMapping("/layout")
    public ResponseEntity<WidgetLayoutResponse> updateLayout(@Valid @RequestBody UpdateLayoutRequest request) {
        return ResponseFactory.ok(widgetService.updateLayout(request));
    }
}
