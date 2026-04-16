import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { SliceResponse } from '../../data-model/modules/common/SliceResponse';
import { AuditLog } from '../../data-model/modules/audit-log/AuditLog';
import { AuditLogFilter } from '../../data-model/modules/audit-log/AuditLogFilter';
import { lastValueFrom } from 'rxjs';
import { getFilters } from '../../shared/util/utils';

@Injectable({ providedIn: 'root' })
export class AdminAuditLogService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/admin/audit-logs';

	public list(filters?: AuditLogFilter, pageIndex = 0): Promise<SliceResponse<AuditLog>> {
		return lastValueFrom(
			this.http.get<SliceResponse<AuditLog>>(this.baseUrl, {
				...getFilters(filters),
				page: pageIndex.toString(),
			}),
		);
	}
}
