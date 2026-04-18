package com.exence.finance.common;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.LogoutService;
import com.exence.finance.modules.auth.service.TokenValidationService;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import com.exence.finance.security.EmailVerificationInterceptor;
import com.exence.finance.security.JwtService;
import com.exence.finance.security.WorkspaceInterceptor;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

public abstract class BaseControllerTest {

    protected static final String WORKSPACE_HEADER = "X-Workspace-ID";
    protected static final long TEST_WORKSPACE_ID = 1L;

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    // JwtAuthenticationFilter dependencies
    @MockitoBean
    protected JwtService jwtService;

    @MockitoBean
    protected UserDetailsService userDetailsService;

    @MockitoBean
    protected TokenValidationService tokenValidationService;

    @MockitoBean
    protected CookieService cookieService;

    // SecurityConfig dependency
    @MockitoBean
    protected LogoutService logoutService;

    // Interceptors — mocked so WebConfig can inject them without their real dependencies
    @MockitoBean
    protected WorkspaceInterceptor workspaceInterceptor;

    @MockitoBean
    protected EmailVerificationInterceptor emailVerificationInterceptor;

    // GlobalExceptionHandler dependency
    @MockitoBean
    protected I18nService i18nService;

    // EmailDomainValidator dependency (triggered via @ValidStrictEmail → @ValidEmailDomain)
    @MockitoBean
    protected SystemSettingsService systemSettingsService;

    @BeforeEach
    void setUpBase() throws Exception {
        given(workspaceInterceptor.preHandle(any(), any(), any()))
                .willReturn(true);
        given(emailVerificationInterceptor.preHandle(any(), any(), any()))
                .willReturn(true);
        given(systemSettingsService.getSettings()).willReturn(new SystemSettings());
    }

    // --- Request helpers ---

    protected ResultActions performGet(String url, Object... vars) throws Exception {
        return mockMvc.perform(get(url, vars).header(WORKSPACE_HEADER, TEST_WORKSPACE_ID));
    }

    protected ResultActions performPost(String url, Object body) throws Exception {
        return mockMvc.perform(post(url)
                .with(csrf())
                .header(WORKSPACE_HEADER, TEST_WORKSPACE_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }

    protected ResultActions performPatch(String url, Object body, Object... vars) throws Exception {
        return mockMvc.perform(patch(url, vars)
                .with(csrf())
                .header(WORKSPACE_HEADER, TEST_WORKSPACE_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }

    protected ResultActions performPut(String url, Object body, Object... vars) throws Exception {
        return mockMvc.perform(put(url, vars)
                .with(csrf())
                .header(WORKSPACE_HEADER, TEST_WORKSPACE_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }

    protected ResultActions performDelete(String url, Object... vars) throws Exception {
        return mockMvc.perform(delete(url, vars).with(csrf()).header(WORKSPACE_HEADER, TEST_WORKSPACE_ID));
    }

    protected ResultActions performDeleteWithBody(String url, Object body, Object... vars) throws Exception {
        return mockMvc.perform(delete(url, vars)
                .with(csrf())
                .header(WORKSPACE_HEADER, TEST_WORKSPACE_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }

    /** For auth, sessions, and exchange-rate endpoints that exclude workspace header. */
    protected ResultActions performGetNoWorkspace(String url, Object... vars) throws Exception {
        return mockMvc.perform(get(url, vars));
    }

    protected ResultActions performPostNoWorkspace(String url, Object body) throws Exception {
        return mockMvc.perform(
                post(url).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(toJson(body)));
    }

    protected ResultActions performDeleteNoWorkspace(String url, Object... vars) throws Exception {
        return mockMvc.perform(delete(url, vars).with(csrf()));
    }

    protected ResultActions performPatchNoWorkspace(String url, Object body, Object... vars) throws Exception {
        return mockMvc.perform(patch(url, vars)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }

    // --- Serialization helpers ---

    protected String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    protected <T> T fromJson(ResultActions result, Class<T> type) throws Exception {
        return objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), type);
    }

    protected <T> T fromJson(ResultActions result, TypeReference<T> typeRef) throws Exception {
        return objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), typeRef);
    }

    /**
     * Parses the validation error response body into a typed map.
     * GlobalExceptionHandler places field errors under the "errors" property of ProblemDetail.
     */
    protected Map<String, String> validationErrors(ResultActions result) throws Exception {
        ProblemDetail problem =
                objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), ProblemDetail.class);
        return objectMapper.convertValue(problem.getProperties().get("errors"), new TypeReference<>() {});
    }
}
