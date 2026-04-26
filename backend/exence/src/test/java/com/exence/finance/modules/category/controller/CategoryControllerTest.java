package com.exence.finance.modules.category.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.CategoryTestFixtures;
import com.exence.finance.modules.category.controller.impl.CategoryControllerImpl;
import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.category.service.CategoryService;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(CategoryControllerImpl.class)
class CategoryControllerTest extends BaseControllerTest {

    @MockitoBean
    private CategoryService categoryService;

    // --- GET /api/categories/{id} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/categories/{id} - returns category by id")
    void getById() throws Exception {
        // given
        CategoryGetDTO dto = CategoryTestFixtures.getDTO();
        given(categoryService.getCategoryById(1L)).willReturn(dto);

        // when
        ResultActions result = performGet("/api/categories/{id}", 1L);

        // then
        result.andExpect(status().isOk());
        CategoryGetDTO body = fromJson(result, CategoryGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(dto);
    }

    @Test
    @DisplayName("GET /api/categories/{id} - 401 when unauthenticated")
    void getById_unauthenticated_returns401() throws Exception {
        performGet("/api/categories/1").andExpect(status().isUnauthorized());
    }

    // --- GET /api/categories ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/categories - returns all categories")
    void getAll() throws Exception {
        // given
        List<CategoryGetDTO> dtos = List.of(CategoryTestFixtures.getDTO());
        given(categoryService.getCategories()).willReturn(dtos);

        // when
        ResultActions result = performGet("/api/categories");

        // then
        result.andExpect(status().isOk());
        List<CategoryGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
        assertThat(body.getFirst().name()).isEqualTo("Food");
    }

    // --- POST /api/categories ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/categories - creates category and returns 201")
    void create() throws Exception {
        // given
        CategoryCreateDTO request = CategoryTestFixtures.createRequest();
        CategoryGetDTO response = CategoryTestFixtures.getDTO();
        given(categoryService.createCategory(request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/categories", request);

        // then
        result.andExpect(status().isCreated());
        CategoryGetDTO body = fromJson(result, CategoryGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(response);
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/categories - 400 when name is blank")
    void create_blankName_returns400() throws Exception {
        // given
        CategoryCreateDTO request =
                new CategoryCreateDTO("", MaterialIcon.LOCAL_GROCERY_STORE, "#FF5722", CategoryType.EXPENSE, null);

        // when
        ResultActions result = performPost("/api/categories", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("name");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/categories - 400 when icon is null")
    void create_nullIcon_returns400() throws Exception {
        // given
        CategoryCreateDTO request = new CategoryCreateDTO("Food", null, "#FF5722", CategoryType.EXPENSE, null);

        // when
        ResultActions result = performPost("/api/categories", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("icon");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/categories - 400 when type is null")
    void create_nullType_returns400() throws Exception {
        // given
        CategoryCreateDTO request =
                new CategoryCreateDTO("Food", MaterialIcon.LOCAL_GROCERY_STORE, "#FF5722", null, null);

        // when
        ResultActions result = performPost("/api/categories", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("type");
    }

    @Test
    @DisplayName("POST /api/categories - 401 when unauthenticated")
    void create_unauthenticated_returns401() throws Exception {
        performPost("/api/categories", CategoryTestFixtures.createRequest()).andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/categories/{id} ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/categories/{id} - updates category and returns updated DTO")
    void update() throws Exception {
        // given
        CategoryPatchDTO request = CategoryTestFixtures.patchRequest();
        CategoryGetDTO updated = new CategoryGetDTO(
                1L,
                "Updated Food",
                MaterialIcon.LOCAL_GROCERY_STORE,
                "#FF5722",
                CategoryType.EXPENSE,
                null,
                java.math.BigDecimal.ZERO);
        given(categoryService.updateCategory(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/categories/{id}", request, 1L);

        // then
        result.andExpect(status().isOk());
        CategoryGetDTO body = fromJson(result, CategoryGetDTO.class);
        assertThat(body.name()).isEqualTo("Updated Food");
    }

    // --- DELETE /api/categories/{id} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/categories/{id} - deletes category and returns 204")
    void delete() throws Exception {
        // given
        willDoNothing().given(categoryService).deleteCategory(1L);

        // when / then
        performDelete("/api/categories/{id}", 1L).andExpect(status().isNoContent());
    }
}
