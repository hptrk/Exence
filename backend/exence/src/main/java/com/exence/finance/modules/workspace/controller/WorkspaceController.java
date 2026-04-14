package com.exence.finance.modules.workspace.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface WorkspaceController {

    @ExenceOpenApi(
            summary = "Create a new workspace",
            description =
                    "Creates a new workspace for the authenticated user. The user becomes the OWNER of the created"
                            + " workspace. A base currency must be specified for financial data within the workspace.",
            successStatus = 200,
            successDescription = "Workspace created and returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<WorkspaceGetDTO> createWorkspace(WorkspaceCreateRequest request);

    @ExenceOpenApi(
            summary = "List all workspaces",
            description = "Returns all workspaces the authenticated user is a member of, including their role in each.",
            successStatus = 200,
            successDescription = "List of workspaces returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<List<WorkspaceGetDTO>> getMyWorkspaces();

    @ExenceOpenApi(
            summary = "Rename a workspace",
            description = "Updates the name of a workspace identified by its ID. Only the workspace owner can perform"
                    + " this action.",
            successStatus = 200,
            successDescription = "Updated workspace returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.WORKSPACE_NOT_FOUND,
                ErrorCode.WORKSPACE_OWNER_REQUIRED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<WorkspaceGetDTO> renameWorkspace(Long workspaceId, WorkspaceRenameRequest request);

    @ExenceOpenApi(
            summary = "Delete a workspace",
            description = "Permanently deletes a workspace identified by its ID. The user must be the owner. The user's"
                    + " last remaining workspace cannot be deleted.",
            successStatus = 204,
            successDescription = "Workspace deleted successfully.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.WORKSPACE_NOT_FOUND,
                ErrorCode.WORKSPACE_OWNER_REQUIRED,
                ErrorCode.WORKSPACE_CANNOT_DELETE_LAST
            })
    ResponseEntity<Void> deleteWorkspace(Long workspaceId);

    @ExenceOpenApi(
            summary = "Add a member to a workspace",
            description =
                    "Adds a user to the workspace by their email address. The target user must already have an account."
                            + " Only the workspace owner can add members. The new member receives the MEMBER role.",
            successStatus = 200,
            successDescription = "Added member returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.WORKSPACE_NOT_FOUND,
                ErrorCode.WORKSPACE_OWNER_REQUIRED,
                ErrorCode.WORKSPACE_MEMBER_ALREADY_EXISTS,
                ErrorCode.USER_NOT_FOUND,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<WorkspaceMemberGetDTO> addMember(Long workspaceId, WorkspaceMemberEmailRequest request);

    @ExenceOpenApi(
            summary = "List workspace members",
            description = "Returns all members of a workspace the authenticated user belongs to.",
            successStatus = 200,
            successDescription = "List of workspace members returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.WORKSPACE_NOT_FOUND})
    ResponseEntity<List<WorkspaceMemberGetDTO>> getMembers(Long workspaceId);

    @ExenceOpenApi(
            summary = "Leave a workspace",
            description = "Removes the authenticated user from the specified workspace. The owner of a workspace"
                    + " cannot leave — ownership must be transferred first.",
            successStatus = 204,
            successDescription = "Successfully left the workspace.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.WORKSPACE_NOT_FOUND,
                ErrorCode.WORKSPACE_OWNER_CANNOT_LEAVE
            })
    ResponseEntity<Void> removeSelf(Long workspaceId);

    @ExenceOpenApi(
            summary = "Remove a member from a workspace",
            description = "Removes a user from a workspace by their email address. Only the workspace owner can remove"
                    + " members. The owner themselves cannot be removed via this endpoint.",
            successStatus = 204,
            successDescription = "Member removed successfully.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.WORKSPACE_NOT_FOUND,
                ErrorCode.WORKSPACE_OWNER_REQUIRED,
                ErrorCode.WORKSPACE_OWNER_CANNOT_BE_REMOVED,
                ErrorCode.USER_NOT_FOUND,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<Void> removeMemberByEmail(Long workspaceId, WorkspaceMemberEmailRequest request);
}
