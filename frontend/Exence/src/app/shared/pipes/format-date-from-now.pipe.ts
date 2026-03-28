import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
	name: 'formatDateFromNow',
})
export class FormatDateFromNowPipe implements PipeTransform {
	private readonly translocoService = inject(TranslocoService);

	transform(value?: Date | string | number): string {
		if (!value) {
			return '';
		}

		const date = new Date(value);

		if (isNaN(date.getTime())) {
			return '';
		}

		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		// Now
		if (diffInSeconds < 15) {
			return this.translocoService.translate('formattedDate.now');
		}

		// Below 1 minute
		if (diffInSeconds < 60) {
			const suffix = diffInSeconds === 1 ? 'sec' : 'secs';
			return this.translocoService.translate(`formattedDate.${suffix}`, { value: diffInSeconds });
		}

		// Below 1 hour
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			const suffix = diffInMinutes === 1 ? 'min' : 'mins';
			return this.translocoService.translate(`formattedDate.${suffix}`, { value: diffInMinutes });
		}

		// Below 1 day
		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			const suffix = diffInHours === 1 ? 'hour' : 'hours';
			return this.translocoService.translate(`formattedDate.${suffix}`, { value: diffInHours });
		}

		// Below 7 days
		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) {
			const suffix = diffInDays === 1 ? 'day' : 'days';
			return this.translocoService.translate(`formattedDate${suffix}`, { value: diffInDays });
		}

		// Below 1 year - use "MMM d" format
		const diffInYears = now.getFullYear() - date.getFullYear();
		if (diffInYears < 1 || (diffInYears === 1 && now.getMonth() < date.getMonth())) {
			const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
			return this.translocoService.translate(`months.${monthNames[date.getMonth()]}`, { day: date.getDate() });
		}

		// Older than a year - use dd/MM/yyyy format
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}
}
