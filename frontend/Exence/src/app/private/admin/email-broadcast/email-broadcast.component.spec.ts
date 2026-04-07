import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { EmailBroadcastComponent } from './email-broadcast.component';
import { AdminEmailService } from '../admin-email.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { TranslocoService } from '@jsverse/transloco';

describe('EmailBroadcastComponent', () => {
	let dialogSpy: jasmine.SpyObj<DialogService>;
	let snackbarSpy: jasmine.SpyObj<SnackbarService>;
	let emailServiceSpy: jasmine.SpyObj<AdminEmailService>;

	beforeEach(async () => {
		dialogSpy = jasmine.createSpyObj('DialogService', ['openNonModal']);
		snackbarSpy = jasmine.createSpyObj('SnackbarService', ['showSuccess']);
		emailServiceSpy = jasmine.createSpyObj('AdminEmailService', ['sendBroadcastEmail']);

		await TestBed.configureTestingModule({
			imports: [EmailBroadcastComponent],
			providers: [
				{ provide: DialogService, useValue: dialogSpy },
				{ provide: SnackbarService, useValue: snackbarSpy },
				{
					provide: TranslocoService,
					useValue: {
						translate: (key: string) => key,
						config: { reRenderOnLangChange: false },
						langChanges$: EMPTY,
						_loadDependencies: () => EMPTY,
					},
				},
			],
		})
			.overrideComponent(EmailBroadcastComponent, {
				set: { providers: [{ provide: AdminEmailService, useValue: emailServiceSpy }] },
			})
			.compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should be invalid when subject is empty', () => {
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.form.invalid).toBeTrue();
	});

	it('should be valid when subject has value', () => {
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		fixture.componentInstance.form.controls.subject.setValue('Test subject');
		expect(fixture.componentInstance.form.valid).toBeTrue();
	});

	it('should be invalid when subject exceeds 255 characters', () => {
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		fixture.componentInstance.form.controls.subject.setValue('a'.repeat(256));
		expect(fixture.componentInstance.form.invalid).toBeTrue();
	});

	it('should clear content on clear()', () => {
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		fixture.componentInstance.form.controls.content.setValue('Some markdown content');
		fixture.componentInstance.clear();
		expect(fixture.componentInstance.form.controls.content.value).toBe('');
	});

	it('should not call sendBroadcastEmail when dialog is cancelled', async () => {
		dialogSpy.openNonModal.and.returnValue(Promise.resolve(false));
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		fixture.componentInstance.form.controls.subject.setValue('Test');
		await fixture.componentInstance.send();
		expect(emailServiceSpy.sendBroadcastEmail).not.toHaveBeenCalled();
	});

	it('should call sendBroadcastEmail and show success snackbar when confirmed', async () => {
		dialogSpy.openNonModal.and.returnValue(Promise.resolve(true));
		emailServiceSpy.sendBroadcastEmail.and.returnValue(Promise.resolve());
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		fixture.componentInstance.form.controls.subject.setValue('Test subject');
		fixture.componentInstance.form.controls.content.setValue('# Hello');
		await fixture.componentInstance.send();
		expect(emailServiceSpy.sendBroadcastEmail).toHaveBeenCalledWith(
			jasmine.objectContaining({ subject: 'Test subject' }),
		);
		expect(snackbarSpy.showSuccess).toHaveBeenCalled();
	});

	it('should set sending to false after successful send', async () => {
		dialogSpy.openNonModal.and.returnValue(Promise.resolve(true));
		emailServiceSpy.sendBroadcastEmail.and.returnValue(Promise.resolve());
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		fixture.componentInstance.form.controls.subject.setValue('Test subject');
		await fixture.componentInstance.send();
		expect(fixture.componentInstance.sending()).toBeFalse();
	});

	it('should set sending to false after sendBroadcastEmail fails', async () => {
		dialogSpy.openNonModal.and.returnValue(Promise.resolve(true));
		emailServiceSpy.sendBroadcastEmail.and.returnValue(Promise.reject(new Error('HTTP error')));
		const fixture = TestBed.createComponent(EmailBroadcastComponent);
		fixture.detectChanges();
		fixture.componentInstance.form.controls.subject.setValue('Test subject');
		await fixture.componentInstance.send().catch(() => {});
		expect(fixture.componentInstance.sending()).toBeFalse();
	});
});
