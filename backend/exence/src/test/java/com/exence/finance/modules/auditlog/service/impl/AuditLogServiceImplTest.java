package com.exence.finance.modules.auditlog.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogFilter;
import com.exence.finance.modules.auditlog.mapper.AuditLogMapper;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.util.stream.Stream;
import org.javers.core.Changes;
import org.javers.core.Javers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceImplTest {

    @Mock
    private Javers javers;

    @Mock
    private UserService userService;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @Mock
    private AuditLogMapper auditLogMapper;

    @InjectMocks
    private AuditLogServiceImpl auditLogService;

    private static final Long WORKSPACE_ID = 1L;
    private static final Long USER_ID = 100L;
    private static final Pageable PAGEABLE = PageRequest.of(0, 10);

    @BeforeEach
    void setUp() {
        WorkspaceContextHolder.setWorkspaceId(WORKSPACE_ID);
    }

    @Test
    @DisplayName("throws WORKSPACE_OWNER_REQUIRED when user is not owner")
    void getWorkspaceAuditLogs_notOwner() {
        // given
        WorkspaceMember member =
                WorkspaceMember.builder().id(1L).role(WorkspaceRole.MEMBER).build();

        given(userService.getCurrentUserId()).willReturn(USER_ID);
        given(workspaceMembershipService.getWorkspaceMember(WORKSPACE_ID, USER_ID))
                .willReturn(member);

        AuditLogFilter filter = new AuditLogFilter(null, null, null, null, null);

        // when / then
        assertThatThrownBy(() -> auditLogService.getWorkspaceAuditLogs(filter, PAGEABLE))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_OWNER_REQUIRED);
    }

    @Test
    @DisplayName("returns empty slice when user is owner and javers has no changes")
    void getWorkspaceAuditLogs_ownerReturnsEmptySlice() {
        // given
        WorkspaceMember owner =
                WorkspaceMember.builder().id(1L).role(WorkspaceRole.OWNER).build();
        Changes emptyChanges = Mockito.mock(Changes.class);
        given(emptyChanges.stream()).willReturn(Stream.of());

        given(userService.getCurrentUserId()).willReturn(USER_ID);
        given(workspaceMembershipService.getWorkspaceMember(WORKSPACE_ID, USER_ID))
                .willReturn(owner);
        given(javers.findChanges(any())).willReturn(emptyChanges);

        AuditLogFilter filter = new AuditLogFilter(null, null, null, null, null);

        // when
        Slice<AuditLogDTO> result = auditLogService.getWorkspaceAuditLogs(filter, PAGEABLE);

        // then
        assertThat(result.getContent()).isEmpty();
        assertThat(result.hasNext()).isFalse();
        then(workspaceMembershipService).should().getWorkspaceMember(WORKSPACE_ID, USER_ID);
    }

    @Test
    @DisplayName("getAllAuditLogs returns empty slice without checking workspace ownership")
    void getAllAuditLogs_returnsEmptySliceWithoutOwnerCheck() {
        // given
        Changes emptyChanges = Mockito.mock(Changes.class);
        given(emptyChanges.stream()).willReturn(Stream.of());
        given(javers.findChanges(any())).willReturn(emptyChanges);

        AuditLogFilter filter = new AuditLogFilter(null, null, null, null, null);

        // when
        Slice<AuditLogDTO> result = auditLogService.getAllAuditLogs(filter, PAGEABLE);

        // then
        assertThat(result.getContent()).isEmpty();
        assertThat(result.hasNext()).isFalse();
        then(userService).shouldHaveNoInteractions();
        then(workspaceMembershipService).shouldHaveNoInteractions();
    }
}
