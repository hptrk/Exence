package com.exence.finance.modules.category.mapper;

import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.category.entity.Category;
import java.math.BigDecimal;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "balance", ignore = true)
    CategoryGetDTO mapToCategoryGetDTO(Category category);

    @Mapping(target = "balance", source = "balance")
    CategoryGetDTO mapToCategoryGetDTO(Category category, BigDecimal balance);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Category mapToCategory(CategoryCreateDTO categoryCreateDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategoryFromPatchDto(CategoryPatchDTO categoryPatchDTO, @MappingTarget Category category);

    default String map(MaterialIcon icon) {
        return icon != null ? icon.name() : null;
    }

    default MaterialIcon map(String iconName) {
        return iconName != null ? MaterialIcon.valueOf(iconName) : null;
    }
}
