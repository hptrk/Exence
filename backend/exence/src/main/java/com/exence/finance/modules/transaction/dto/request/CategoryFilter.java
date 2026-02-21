package com.exence.finance.modules.transaction.dto.request;

import com.exence.finance.modules.category.dto.CategoryType;
import java.io.Serializable;
import java.util.Objects;
import java.util.stream.Stream;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class CategoryFilter implements Serializable {
    private CategoryType type;

    public boolean hasActiveFilter() {
        return Stream.of(type).anyMatch(Objects::nonNull);
    }
}
