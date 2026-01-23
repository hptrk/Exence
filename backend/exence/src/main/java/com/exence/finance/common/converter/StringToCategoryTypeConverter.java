package com.exence.finance.common.converter;

import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.transaction.dto.TransactionType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToCategoryTypeConverter implements Converter<String, CategoryType> {

    @Override
    public CategoryType convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }

        try {
            return CategoryType.valueOf(source.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return CategoryType.fromValue(source);
        }
    }
}
