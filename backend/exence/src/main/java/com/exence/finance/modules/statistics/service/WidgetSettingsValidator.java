package com.exence.finance.modules.statistics.service;

import com.exence.finance.common.exception.InvalidWidgetSettingException;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WidgetSettingsValidator {

    private final CategoryRepository categoryRepository;

    public void validate(Map<WidgetSetting, Object> settings) {
        if (settings == null) {
            return;
        }
        validateCategoryIds(settings);
    }

    private void validateCategoryIds(Map<WidgetSetting, Object> settings) {
        Object value = settings.get(WidgetSetting.CATEGORY_IDS);
        if (value == null) {
            return;
        }
        if (!(value instanceof List<?> list)) {
            throw new InvalidWidgetSettingException("categoryIds must be an array");
        }
        if (list.isEmpty()) {
            return;
        }
        boolean hasNonNumber = list.stream().anyMatch(item -> !(item instanceof Number));
        if (hasNonNumber) {
            throw new InvalidWidgetSettingException("categoryIds must contain only numbers");
        }
        List<Long> ids = list.stream()
                .map(item -> ((Number) item).longValue())
                .distinct()
                .toList();
        Set<Long> foundIds = categoryRepository.findExistingIds(ids);
        if (foundIds.size() < ids.size()) {
            List<Long> missing =
                    ids.stream().filter(id -> !foundIds.contains(id)).toList();
            throw new InvalidWidgetSettingException("Category IDs not found: " + missing);
        }
    }
}
