package com.exence.finance.modules.category.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryFilter;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Categories", description = "Transaction category management")
public interface CategoryController {
    @ExenceOpenApi(
            summary = "Get a category by ID",
            description = "Returns a single transaction category belonging to the authenticated user, identified by its"
                    + " ID.",
            successStatus = 200,
            successDescription = "Category returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.CATEGORY_NOT_FOUND})
    ResponseEntity<CategoryGetDTO> getCategoryById(@PathVariable Long id);

    @ExenceOpenApi(
            summary = "List all categories",
            description = "Returns all transaction categories belonging to the authenticated user, ordered by name.",
            successStatus = 200,
            successDescription = "List of categories returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<List<CategoryGetDTO>> getCategories();

    @ExenceOpenApi(
            summary = "Get top categories by total amount",
            description = "Returns the categories with the highest cumulative transaction amounts for the authenticated"
                    + " user. The result can be filtered by category type using the query parameter. Used for"
                    + " summary cards.",
            successStatus = 200,
            successDescription = "List of top categories with their total amounts returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<List<CategorySummaryResponse>> getTopCategoreiesByTotalAmount(CategoryFilter filter);

    @ExenceOpenApi(
            summary = "Create a new category",
            description = "Creates a new transaction category for the authenticated user with the given name, type,"
                    + " icon, and color. Category names must be unique per user.",
            successStatus = 201,
            successDescription = "Category created; Location header points to the new resource.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.CATEGORY_ALREADY_EXISTS, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<CategoryGetDTO> createCategory(CategoryCreateDTO categoryCreateDTO);

    @ExenceOpenApi(
            summary = "Update a category",
            description = "Partially updates a transaction category identified by its ID. Only the fields provided in"
                    + " the request body are changed. The name must remain unique across the user's"
                    + " categories.",
            successStatus = 200,
            successDescription = "Updated category returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.CATEGORY_ALREADY_EXISTS,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<CategoryGetDTO> updateCategory(Long id, CategoryPatchDTO categoryPatchDTO);

    @ExenceOpenApi(
            summary = "Delete a category",
            description = "Permanently deletes a transaction category identified by its ID. Deletion is blocked if the"
                    + " category is still referenced by one or more transactions.",
            successStatus = 204,
            successDescription = "Category deleted successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.CATEGORY_NOT_FOUND, ErrorCode.CATEGORY_IN_USE})
    ResponseEntity<Void> deleteCategory(Long id);
}
