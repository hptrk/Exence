package com.exence.finance.modules.auth.mapper;

import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.dto.SessionSummaryProjection;
import com.exence.finance.modules.auth.service.DeviceDetectionService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
@RequiredArgsConstructor
public abstract class SessionMapper {

    @Autowired
    protected DeviceDetectionService deviceDetectionService;

    @Mapping(target = "deviceName", source = "session", qualifiedByName = "extractDeviceName")
    @Mapping(target = "browser", source = "session", qualifiedByName = "extractBrowser")
    @Mapping(target = "operatingSystem", source = "session", qualifiedByName = "extractOperatingSystem")
    @Mapping(target = "sessionId", source = "session.sessionId")
    @Mapping(target = "ipAddress", source = "session.ipAddress")
    @Mapping(target = "lastUsedAt", source = "session.lastUsedAt")
    @Mapping(target = "createdAt", source = "session.createdAt")
    @Mapping(target = "isCurrentSession", source = "session", qualifiedByName = "isCurrentSession")
    public abstract DeviceSessionDTO mapToDeviceSessionDTO(SessionSummaryProjection session, @Context String currentSessionId);

    public abstract List<DeviceSessionDTO> mapToDeviceSessionDTOList(List<SessionSummaryProjection> sessions, @Context String currentSessionId);

    @Named("extractDeviceName")
    protected String extractDeviceName(SessionSummaryProjection session) {
        return deviceDetectionService.parseDeviceName(session.getUserAgent());
    }

    @Named("extractBrowser")
    protected String extractBrowser(SessionSummaryProjection session) {
        return deviceDetectionService.parseBrowser(session.getUserAgent());
    }

    @Named("extractOperatingSystem")
    protected String extractOperatingSystem(SessionSummaryProjection session) {
        return deviceDetectionService.parseOperatingSystem(session.getUserAgent());
    }

    @Named("isCurrentSession")
    protected boolean isCurrentSession(SessionSummaryProjection session, @Context String currentSessionId) {
        return session.getSessionId().equals(currentSessionId);
    }
}