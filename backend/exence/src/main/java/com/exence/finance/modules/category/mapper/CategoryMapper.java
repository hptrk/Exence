package com.exence.finance.modules.category.mapper;

import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.category.entity.Category;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDTO mapToCategoryDTO(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Category mapToCategory(CategoryDTO categoryDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateCategoryFromDto(CategoryDTO categoryDTO, @MappingTarget Category category);

    List<CategoryDTO> mapToCategoryDTOList(List<Category> category);

    List<Category> mapToCategoryList(List<CategoryDTO> categoryDTOs);

    default String map(MaterialIcon icon) {
        return icon != null ? icon.name() : null;
    }

    default MaterialIcon map(String iconName) {
        return iconName != null ? MaterialIcon.valueOf(iconName) : null;
    }
}
