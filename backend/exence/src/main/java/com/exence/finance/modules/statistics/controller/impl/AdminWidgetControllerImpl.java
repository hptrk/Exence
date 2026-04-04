package com.exence.finance.modules.statistics.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.statistics.controller.AdminWidgetController;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.service.AdminWidgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AdminWidgetControllerImpl implements AdminWidgetController {

    private final AdminWidgetService adminWidgetService;

    @Override
    @GetMapping("/{type}")
    public ResponseEntity<AdminWidgetDataResponse> getWidgetData(
            @PathVariable AdminWidgetType type, @RequestParam(required = false) Timeframe timeframe) {
        return ResponseFactory.ok(adminWidgetService.getWidgetData(type, timeframe));
    }
}
