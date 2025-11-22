package com.exence.finance.modules.auth.service;

public interface DeviceDetectionService {

    String parseDeviceName(String userAgent);

    String parseBrowser(String userAgent);

    String parseOperatingSystem(String userAgent);

}