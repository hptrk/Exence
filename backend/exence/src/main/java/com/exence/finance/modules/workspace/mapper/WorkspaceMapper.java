package com.exence.finance.modules.workspace.mapper;

import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface WorkspaceMapper {

    @Mapping(target = "role", source = "workspace", qualifiedByName = "resolveRole")
    WorkspaceGetDTO mapToGetDTO(Workspace workspace, @Context Long currentUserId);

    @Mapping(target = "userId", source = "member.user.id")
    @Mapping(target = "username", source = "member.user.displayUsername")
    @Mapping(target = "email", source = "member.user.email")
    WorkspaceMemberGetDTO mapMemberToGetDTO(WorkspaceMember member);

    @Named("resolveRole")
    default WorkspaceRole resolveRole(Workspace workspace, @Context Long userId) {
        return workspace.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .map(WorkspaceMember::getRole)
                .findFirst()
                .orElse(null);
    }
}
