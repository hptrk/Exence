package com.exence.finance.modules.systemsettings.mapper;

import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SystemSettingsMapper {
    SystemSettingsResponse toResponse(SystemSettings settings);
}
