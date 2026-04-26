package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.mapper.UserMapper;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.security.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtService jwtService;

    @Mock
    private CookieService cookieService;

    @Mock
    private RequestContextService requestContextService;

    @InjectMocks
    private UserServiceImpl service;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("get user from token valid")
    void getUserFromToken_valid() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        User user = UserTestFixtures.defaultUser();
        UserGetDTO dto = new UserGetDTO(1L, "testuser", "test@example.com", true, null);

        given(requestContextService.getCurrentRequest()).willReturn(request);
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn("access.token");
        given(jwtService.extractUsername("access.token")).willReturn("test@example.com");
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));
        given(userMapper.mapToUserGetDto(user)).willReturn(dto);

        // when
        UserGetDTO result = service.getUserFromToken();

        // then
        assertThat(result.id()).isEqualTo(1L);
    }

    @Test
    @DisplayName("get user from token no request")
    void getUserFromToken_noRequest() {
        // given
        given(requestContextService.getCurrentRequest()).willReturn(null);

        // when / then
        assertThatThrownBy(() -> service.getUserFromToken())
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.USER_NOT_FOUND);
    }

    @Test
    @DisplayName("get user from token no cookie")
    void getUserFromToken_noCookie() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        given(requestContextService.getCurrentRequest()).willReturn(request);
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(null);

        // when / then
        assertThatThrownBy(() -> service.getUserFromToken())
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.USER_NOT_FOUND);
    }

    @Test
    @DisplayName("get current user valid")
    void getCurrentUser_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // when
        User result = service.getCurrentUser();

        // then
        assertThat(result.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("get current user no authentication")
    void getCurrentUser_noAuthentication() {
        // given
        // no authentication in security context

        // when / then
        assertThatThrownBy(() -> service.getCurrentUser())
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.USER_NOT_FOUND);
    }

    @Test
    @DisplayName("get user by email valid")
    void getUserByEmail_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));

        // when
        User result = service.getUserByEmail("test@example.com");

        // then
        assertThat(result.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("get user by email unknown")
    void getUserByEmail_unknown() {
        // given
        given(userRepository.findByEmail("unknown@example.com")).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> service.getUserByEmail("unknown@example.com"))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.USER_NOT_FOUND);
    }

    @Test
    @DisplayName("delete user valid")
    void deleteUser_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // when
        service.deleteUser();

        // then
        then(userRepository).should().delete(user);
    }
}
