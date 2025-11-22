package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.modules.auth.service.DeviceDetectionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DeviceDetectionServiceImpl implements DeviceDetectionService {
    @Override
    public String parseDeviceName(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "Unknown Device";
        }

        if (userAgent.contains("Mobile") || userAgent.contains("Android")) {
            if (userAgent.contains("iPhone")) return "iPhone";
            if (userAgent.contains("iPad")) return "iPad";
            if (userAgent.contains("Android")) return "Android Device";
            return "Mobile Device";
        }

        if (userAgent.contains("Windows")) return "Windows PC";
        if (userAgent.contains("Macintosh")) return "Mac";
        if (userAgent.contains("Linux")) return "Linux PC";

        return "Unknown Device";
    }

    @Override
    public String parseBrowser(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "Unknown Browser";
        }

        if (userAgent.contains("Chrome") && !userAgent.contains("Edg")) return "Chrome";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("Safari") && !userAgent.contains("Chrome")) return "Safari";
        if (userAgent.contains("Edg")) return "Edge";
        if (userAgent.contains("Opera")) return "Opera";

        return "Unknown Browser";
    }

    @Override
    public String parseOperatingSystem(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "Unknown OS";
        }

        if (userAgent.contains("Windows NT 10.0")) return "Windows 10/11";
        if (userAgent.contains("Windows NT 6.3")) return "Windows 8.1";
        if (userAgent.contains("Windows NT 6.1")) return "Windows 7";
        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Mac OS X")) return "macOS";
        if (userAgent.contains("Linux")) return "Linux";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iOS")) return "iOS";

        return "Unknown OS";
    }
}
