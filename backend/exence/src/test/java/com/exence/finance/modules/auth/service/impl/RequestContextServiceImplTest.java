package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

class RequestContextServiceImplTest {

    private RequestContextServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new RequestContextServiceImpl();
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    @DisplayName("get current request active request")
    void getCurrentRequest_activeRequest() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        // when
        HttpServletRequest result = service.getCurrentRequest();

        // then
        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("get current request no active request")
    void getCurrentRequest_noActiveRequest() {
        // given
        // no active request in context

        // when
        HttpServletRequest result = service.getCurrentRequest();

        // then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("extract user agent header")
    void extractUserAgent_userAgentHeader() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0)");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        // when
        String result = service.extractUserAgent();

        // then
        assertThat(result).isEqualTo("Mozilla/5.0 (Windows NT 10.0)");
    }

    @Test
    @DisplayName("extract user agent no active request")
    void extractUserAgent_noActiveRequest() {
        // given
        // no active request in context

        // when
        String result = service.extractUserAgent();

        // then
        assertThat(result).isEqualTo("Unknown");
    }

    @Test
    @DisplayName("extract ip address X-Forwarded-For")
    void extractIpAddress_xForwardedFor() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Forwarded-For", "192.168.1.1, 10.0.0.1");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        // when
        String result = service.extractIpAddress();

        // then
        assertThat(result).isEqualTo("192.168.1.1");
    }

    @Test
    @DisplayName("extract ip address remote addr")
    void extractIpAddress_remoteAddr() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("127.0.0.1");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        // when
        String result = service.extractIpAddress();

        // then
        assertThat(result).isEqualTo("127.0.0.1");
    }

    @Test
    @DisplayName("extract ip address no active request")
    void extractIpAddress_noActiveRequest() {
        // given
        // no active request in context

        // when
        String result = service.extractIpAddress();

        // then
        assertThat(result).isEqualTo("Unknown");
    }
}
