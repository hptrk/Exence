package com.exence.finance.common.converter;

import com.exence.finance.modules.statistics.dto.Timeframe;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToTimeframeConverter implements Converter<String, Timeframe> {

    @Override
    public Timeframe convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }

        return Timeframe.fromCode(source.trim());
    }
}
