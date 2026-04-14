package com.exence.finance.common.dto;

import java.util.List;
import org.springframework.data.domain.Slice;

public record SliceResponse<T>(
        List<T> content,
        int page,
        int size,
        boolean first,
        boolean last,
        boolean hasNext,
        int numberOfElements) {

    public static <T> SliceResponse<T> from(Slice<T> slice) {
        return new SliceResponse<>(
                slice.getContent(),
                slice.getNumber(),
                slice.getSize(),
                slice.isFirst(),
                slice.isLast(),
                slice.hasNext(),
                slice.getNumberOfElements());
    }
}
