package com.exence.finance.modules.workspace.mapper;

import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import com.exence.finance.modules.workspace.entity.WorkspaceSettings;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface WorkspaceSettingsMapper {

    WorkspaceSettingsGetDTO toGetDTO(WorkspaceSettings entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(WorkspaceSettingsPatchRequest request, @MappingTarget WorkspaceSettings entity);
}
