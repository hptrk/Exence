package com.exence.finance.modules.auth.mapper;

import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.dto.SessionSummaryProjection;
import com.exence.finance.modules.auth.service.DeviceDetectionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

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
    public abstract DeviceSessionDTO mapToDeviceSessionDTO(
            SessionSummaryProjection session, @Context String currentSessionId);

    public abstract List<DeviceSessionDTO> mapToDeviceSessionDTOList(
            List<SessionSummaryProjection> sessions, @Context String currentSessionId);

    @Named("extractDeviceName")
    protected String extractDeviceName(SessionSummaryProjection session) {
        return deviceDetectionService.parseDeviceName(session.userAgent());
    }

    @Named("extractBrowser")
    protected String extractBrowser(SessionSummaryProjection session) {
        return deviceDetectionService.parseBrowser(session.userAgent());
    }

    @Named("extractOperatingSystem")
    protected String extractOperatingSystem(SessionSummaryProjection session) {
        return deviceDetectionService.parseOperatingSystem(session.userAgent());
    }

    @Named("isCurrentSession")
    protected boolean isCurrentSession(SessionSummaryProjection session, @Context String currentSessionId) {
        return session.sessionId().equals(currentSessionId);
    }
}
