package com.exence.finance.common.converter;

import com.exence.finance.modules.transaction.dto.TransactionType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToTransactionTypeConverter implements Converter<String, TransactionType> {

    @Override
    public TransactionType convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }

        try {
            return TransactionType.valueOf(source.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return TransactionType.fromValue(source);
        }
    }
}
