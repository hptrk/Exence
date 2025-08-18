package com.exence.finance.modules.category.mapper;

import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDTO mapToCategoryDTO(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    Category mapToCategory(CategoryDTO categoryDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    void updateCategoryFromDto(CategoryDTO categoryDTO, @MappingTarget Category category);

    List<CategoryDTO> mapToCategoryDTOList(List<Category> category);

    List<Category> mapToCategoryList(List<CategoryDTO> categoryDTOs);

}
