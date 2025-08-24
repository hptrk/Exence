package com.exence.finance.modules.category.service;

import com.exence.finance.modules.category.dto.request.CategoryIdRequest;
import com.exence.finance.modules.category.dto.request.CreateCategoryRequest;
import com.exence.finance.modules.category.dto.request.DeleteCategoryRequest;
import com.exence.finance.modules.category.dto.request.EmptyCategoryRequest;
import com.exence.finance.modules.category.dto.request.UpdateCategoryRequest;
import com.exence.finance.modules.category.dto.response.CategoryResponse;
import com.exence.finance.modules.category.dto.response.CreateCategoryResponse;
import com.exence.finance.modules.category.dto.response.EmptyCategoryResponse;
import com.exence.finance.modules.category.dto.response.GetCategoriesResponse;

public interface CategoryService {
    public CategoryResponse getCategory(CategoryIdRequest request);

    public GetCategoriesResponse getCategories(EmptyCategoryRequest request);

    public CreateCategoryResponse createCategory(CreateCategoryRequest request);

    public CategoryResponse updateCategory(UpdateCategoryRequest request);

    public EmptyCategoryResponse deleteCategory(DeleteCategoryRequest request);
}
