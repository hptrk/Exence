package com.exence.finance.modules.statistics.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WidgetSettingsValidatorTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private WidgetSettingsValidator validator;

    @Test
    @DisplayName("validate does nothing when settings is null")
    void validate_nullSettings() {
        validator.validate(null);

        then(categoryRepository).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("validate does nothing when CATEGORY_IDS key is absent from settings")
    void validate_noCategoryIdsKey() {
        Map<WidgetSetting, Object> settings = new EnumMap<>(WidgetSetting.class);
        settings.put(WidgetSetting.ICON, "star");

        validator.validate(settings);

        then(categoryRepository).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("throws INVALID_WIDGET_SETTING when CATEGORY_IDS value is not a List")
    void validate_categoryIdsNotAList() {
        Map<WidgetSetting, Object> settings = new EnumMap<>(WidgetSetting.class);
        settings.put(WidgetSetting.CATEGORY_IDS, "not-a-list");

        assertThatThrownBy(() -> validator.validate(settings))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_WIDGET_SETTING);
    }

    @Test
    @DisplayName("throws INVALID_WIDGET_SETTING when CATEGORY_IDS list contains non-Number elements")
    void validate_categoryIdsContainsNonNumbers() {
        Map<WidgetSetting, Object> settings = new EnumMap<>(WidgetSetting.class);
        settings.put(WidgetSetting.CATEGORY_IDS, List.of(1, "not-a-number", 3));

        assertThatThrownBy(() -> validator.validate(settings))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_WIDGET_SETTING);
    }

    @Test
    @DisplayName("validate does nothing when CATEGORY_IDS is an empty list")
    void validate_categoryIdsEmptyList() {
        Map<WidgetSetting, Object> settings = new EnumMap<>(WidgetSetting.class);
        settings.put(WidgetSetting.CATEGORY_IDS, List.of());

        validator.validate(settings);

        then(categoryRepository).should(never()).findExistingIds(List.of());
    }

    @Test
    @DisplayName("validate passes silently when all category IDs exist in the repository")
    void validate_allIdsExist() {
        List<Number> ids = List.of(1L, 2L, 3L);
        Map<WidgetSetting, Object> settings = new EnumMap<>(WidgetSetting.class);
        settings.put(WidgetSetting.CATEGORY_IDS, ids);

        given(categoryRepository.findExistingIds(List.of(1L, 2L, 3L))).willReturn(Set.of(1L, 2L, 3L));

        validator.validate(settings);
    }

    @Test
    @DisplayName("throws INVALID_WIDGET_SETTING when some category IDs do not exist")
    void validate_someIdsMissing() {
        List<Number> ids = List.of(1L, 2L, 99L);
        Map<WidgetSetting, Object> settings = new EnumMap<>(WidgetSetting.class);
        settings.put(WidgetSetting.CATEGORY_IDS, ids);

        given(categoryRepository.findExistingIds(List.of(1L, 2L, 99L))).willReturn(Set.of(1L, 2L));

        assertThatThrownBy(() -> validator.validate(settings))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_WIDGET_SETTING);
    }
}
