import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceService } from '../../workspace.service';
import { CurrentUserService } from '../../user/current-user.service';

export function workspaceInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const workspaceService = inject(WorkspaceService);
	const currentUserService = inject(CurrentUserService);

	if (!currentUserService.isAuthenticated() || !workspaceService.currentWorkspace()) return next(req);

	return next(
		req.clone({
			setHeaders: {
				'X-Workspace-ID': String(workspaceService.currentWorkspace()!.id),
			},
		}),
	);
}
