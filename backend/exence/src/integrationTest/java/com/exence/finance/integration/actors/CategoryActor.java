package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategoryType;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import java.util.List;

/**
 * Domain DSL for category operations.
 *
 * <p>Encapsulates RestAssured calls for: create, get, list, patch, and delete categories.
 */
public class CategoryActor extends BaseActor {

    public CategoryActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    /** Creates a default expense category using ITFixtures defaults. */
    public CategoryGetDTO createExpenseCategory(AuthContext ctx) {
        return createCategory(ctx, ITFixtures.expenseCategory().build());
    }

    /** Creates a default income category using ITFixtures defaults. */
    public CategoryGetDTO createIncomeCategory(AuthContext ctx) {
        return createCategory(ctx, ITFixtures.incomeCategory().build());
    }

    /** Creates a category from the given DTO. */
    public CategoryGetDTO createCategory(AuthContext ctx, CategoryCreateDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .post("/categories")
                .then()
                .statusCode(201)
                .extract()
                .as(CategoryGetDTO.class);
    }

    /** Fetches a single category by ID. */
    public CategoryGetDTO getCategory(AuthContext ctx, long id) {
        return inWorkspace(ctx)
                .when()
                .get("/categories/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(CategoryGetDTO.class);
    }

    /** Returns all categories for the current workspace. */
    public List<CategoryGetDTO> listCategories(AuthContext ctx) {
        CategoryGetDTO[] result = inWorkspace(ctx)
                .when()
                .get("/categories")
                .then()
                .statusCode(200)
                .extract()
                .as(CategoryGetDTO[].class);
        return List.of(result);
    }

    /** Returns the top categories by total amount for the given type. */
    public ValidatableResponse listTopByAmountRaw(AuthContext ctx, CategoryType type) {
        return inWorkspace(ctx).queryParam("type", type.name()).when().get("/categories/top").then();
    }

    /** Updates a category with the given patch DTO. */
    public CategoryGetDTO patchCategory(AuthContext ctx, long id, CategoryPatchDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .patch("/categories/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(CategoryGetDTO.class);
    }

    /** Deletes the category with the given ID. */
    public void deleteCategory(AuthContext ctx, long id) {
        inWorkspace(ctx).when().delete("/categories/{id}", id).then().statusCode(204);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    public ValidatableResponse createCategoryRaw(AuthContext ctx, CategoryCreateDTO dto) {
        return inWorkspace(ctx).body(dto).when().post("/categories").then();
    }

    /** Creates category without the X-Workspace-ID header (tests missing-header validation). */
    public ValidatableResponse createCategoryWithoutWorkspaceHeaderRaw(AuthContext ctx, CategoryCreateDTO dto) {
        return given(spec).cookies(ctx.cookies()).body(dto).when().post("/categories").then();
    }

    public ValidatableResponse listCategoriesRaw(AuthContext ctx) {
        return inWorkspace(ctx).when().get("/categories").then();
    }

    public ValidatableResponse deleteCategoryRaw(AuthContext ctx, long id) {
        return inWorkspace(ctx).when().delete("/categories/{id}", id).then();
    }

    public ValidatableResponse getCategoryRaw(AuthContext ctx, long id) {
        return inWorkspace(ctx).when().get("/categories/{id}", id).then();
    }
}
