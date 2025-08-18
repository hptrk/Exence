package com.exence.finance.modules.category.controller.impl;

import com.exence.finance.modules.category.controller.CategoryController;
import com.exence.finance.modules.category.dto.request.CategoryIdRequest;
import com.exence.finance.modules.category.dto.request.CreateCategoryRequest;
import com.exence.finance.modules.category.dto.request.DeleteCategoryRequest;
import com.exence.finance.modules.category.dto.request.EmptyCategoryRequest;
import com.exence.finance.modules.category.dto.request.UpdateCategoryRequest;
import com.exence.finance.modules.category.dto.response.CategoryResponse;
import com.exence.finance.modules.category.dto.response.CreateCategoryResponse;
import com.exence.finance.modules.category.dto.response.EmptyCategoryResponse;
import com.exence.finance.modules.category.dto.response.GetCategoriesResponse;
import com.exence.finance.modules.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CategoryControllerImpl implements CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/getCategory")
    public CategoryResponse getCategory(CategoryIdRequest request) {
        CategoryResponse response = categoryService.getCategory(request);
        return response;
    }

    @PostMapping("/getCategories")
    public GetCategoriesResponse getCategories(EmptyCategoryRequest request) {
        GetCategoriesResponse response = categoryService.getCategories(request);
        return response;
    }

    @PostMapping("/createCategory")
    public CreateCategoryResponse createCategory(CreateCategoryRequest request) {
        CreateCategoryResponse response = categoryService.createCategory(request);
        return response;
    }

    @PostMapping("/updateCategory")
    public CategoryResponse updateCategory(UpdateCategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(request);
        return response;
    }

    @PostMapping("/deleteCategory")
    public EmptyCategoryResponse deleteCategory(DeleteCategoryRequest request) {
        EmptyCategoryResponse response = categoryService.deleteCategory(request);
        return response;
    }
}
