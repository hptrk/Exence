package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DeviceDetectionServiceImplTest {

    private final DeviceDetectionServiceImpl service = new DeviceDetectionServiceImpl();

    @Test
    @DisplayName("parse device name null user agent")
    void parseDeviceName_nullUserAgent() {
        // given
        String userAgent = null;

        // when
        String result = service.parseDeviceName(userAgent);

        // then
        assertThat(result).isEqualTo("Unknown Device");
    }

    @Test
    @DisplayName("parse device name iphone")
    void parseDeviceName_iPhone() {
        // given
        String userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148";

        // when
        String result = service.parseDeviceName(userAgent);

        // then
        assertThat(result).isEqualTo("iPhone");
    }

    @Test
    @DisplayName("parse device name ipad")
    void parseDeviceName_iPad() {
        // given
        String userAgent = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) Mobile/15E148";

        // when
        String result = service.parseDeviceName(userAgent);

        // then
        assertThat(result).isEqualTo("iPad");
    }

    @Test
    @DisplayName("parse device name android")
    void parseDeviceName_android() {
        // given
        String userAgent = "Mozilla/5.0 (Linux; Android 13; Pixel 7) Mobile/20.0";

        // when
        String result = service.parseDeviceName(userAgent);

        // then
        assertThat(result).isEqualTo("Android Device");
    }

    @Test
    @DisplayName("parse device name windows")
    void parseDeviceName_windows() {
        // given
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

        // when
        String result = service.parseDeviceName(userAgent);

        // then
        assertThat(result).isEqualTo("Windows PC");
    }

    @Test
    @DisplayName("parse device name mac")
    void parseDeviceName_mac() {
        // given
        String userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

        // when
        String result = service.parseDeviceName(userAgent);

        // then
        assertThat(result).isEqualTo("Mac");
    }

    @Test
    @DisplayName("parse device name linux")
    void parseDeviceName_linux() {
        // given
        String userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36";

        // when
        String result = service.parseDeviceName(userAgent);

        // then
        assertThat(result).isEqualTo("Linux PC");
    }

    @Test
    @DisplayName("parse browser null user agent")
    void parseBrowser_nullUserAgent() {
        // given
        String userAgent = null;

        // when
        String result = service.parseBrowser(userAgent);

        // then
        assertThat(result).isEqualTo("Unknown Browser");
    }

    @Test
    @DisplayName("parse browser chrome")
    void parseBrowser_chrome() {
        // given
        String userAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/120.0";

        // when
        String result = service.parseBrowser(userAgent);

        // then
        assertThat(result).isEqualTo("Chrome");
    }

    @Test
    @DisplayName("parse browser edge")
    void parseBrowser_edge() {
        // given
        String userAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/120.0 Edg/120.0";

        // when
        String result = service.parseBrowser(userAgent);

        // then
        assertThat(result).isEqualTo("Edge");
    }

    @Test
    @DisplayName("parse browser firefox")
    void parseBrowser_firefox() {
        // given
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/120.0";

        // when
        String result = service.parseBrowser(userAgent);

        // then
        assertThat(result).isEqualTo("Firefox");
    }

    @Test
    @DisplayName("parse browser safari")
    void parseBrowser_safari() {
        // given
        String userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 Safari/604.1";

        // when
        String result = service.parseBrowser(userAgent);

        // then
        assertThat(result).isEqualTo("Safari");
    }

    @Test
    @DisplayName("parse operating system windows")
    void parseOperatingSystem_windows() {
        // given
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

        // when
        String result = service.parseOperatingSystem(userAgent);

        // then
        assertThat(result).isEqualTo("Windows 10/11");
    }

    @Test
    @DisplayName("parse operating system macos")
    void parseOperatingSystem_macOs() {
        // given
        String userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";

        // when
        String result = service.parseOperatingSystem(userAgent);

        // then
        assertThat(result).isEqualTo("macOS");
    }

    @Test
    @DisplayName("parse operating system linux")
    void parseOperatingSystem_linux() {
        // given
        String userAgent = "Mozilla/5.0 (X11; Linux x86_64)";

        // when
        String result = service.parseOperatingSystem(userAgent);

        // then
        assertThat(result).isEqualTo("Linux");
    }

    @Test
    @DisplayName("parse operating system null user agent")
    void parseOperatingSystem_nullUserAgent() {
        // given
        String userAgent = null;

        // when
        String result = service.parseOperatingSystem(userAgent);

        // then
        assertThat(result).isEqualTo("Unknown OS");
    }
}
