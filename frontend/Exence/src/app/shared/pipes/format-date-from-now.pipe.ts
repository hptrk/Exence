import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatDateFromNow',
})
export class FormatDateFromNowPipe implements PipeTransform {
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
			return 'Now';
		}

		// Below 1 minute
		if (diffInSeconds < 60) {
			return `${diffInSeconds} sec. ago`;
		}
		
		// Below 1 hour
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} min. ago`;
		}
		
		// Below 1 day
		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			const hourText = diffInHours === 1 ? 'hour' : 'hours';
			return `${diffInHours} ${hourText} ago`;
		}
		
		// Below 7 days
		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) {
			const dayText = diffInDays === 1 ? 'day' : 'days';
			return `${diffInDays} ${dayText} ago`;
		}
		
		// Below 1 year - use "MMM d" format
		const diffInYears = now.getFullYear() - date.getFullYear();
		if (diffInYears < 1 || (diffInYears === 1 && now.getMonth() < date.getMonth())) {
			const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			return `${monthNames[date.getMonth()]} ${date.getDate()}`;
		}
		
		// Older than a year - use dd/MM/yyyy format
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}
}