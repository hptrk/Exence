import { signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
	getAllActionBtns,
	getClearBtn,
	getCloseBtn,
	getIconBtn,
	getInfoBtn,
	getNativeBtn,
	getNoteIcon,
	getRegularBtn,
	getTogglePasswordBtn,
	clickTogglePasswordBtn,
} from '../locators/shared-components.locators';
import { MAT_SNACK_BAR_DATA, MatSnackBarDismiss, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY, Observable } from 'rxjs';

import { AnimatedSkeletonLoaderComponent } from '../../../app/shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { NoteBoxComponent } from '../../../app/shared/note-box/note-box.component';
import { InputClearButtonComponent } from '../../../app/shared/input-clear-button/input-clear-button.component';
import { ButtonComponent } from '../../../app/shared/button/button.component';
import { ValidatorComponent } from '../../../app/shared/validator/validator.component';
import { ShowPasswordComponent } from '../../../app/shared/show-password/show-password.component';
import { DialogCardComponent } from '../../../app/shared/dialog-card/dialog-card.component';
import { SnackbarComponent, SnackbarData } from '../../../app/shared/snackbar/snackbar.component';
import {
	MessageDialogComponent,
	MessageDialogButtonConfig,
	MessageDialogData,
} from '../../../app/shared/message-dialog/message-dialog.component';
import { InfoButtonComponent } from '../../../app/shared/info-button/info-button.component';
import { DisplaySizeService } from '../../../app/shared/display-size.service';
import { DialogRef } from '../../../app/shared/dialog/dialog.service';
import { SnackbarType } from '../../../app/shared/snackbar/snackbar.service';

const mockTransloco = {
	translate: (key: string) => key,
	config: { reRenderOnLangChange: false },
	langChanges$: EMPTY,
	_loadDependencies: () => EMPTY,
};

const mockDisplay = {
	isSm: signal(true),
	isMd: signal(true),
	getObserverByName: () => signal(true),
};

// AnimatedSkeletonLoaderComponent
describe('AnimatedSkeletonLoaderComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AnimatedSkeletonLoaderComponent],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(AnimatedSkeletonLoaderComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should apply default width and height', () => {
		const fixture = TestBed.createComponent(AnimatedSkeletonLoaderComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.width()).toBe('50px');
		expect(fixture.componentInstance.height()).toBe('50px');
	});

	it('should compute border-radius as 20px for rect shape', () => {
		const fixture = TestBed.createComponent(AnimatedSkeletonLoaderComponent);
		fixture.componentRef.setInput('shape', 'rect');
		fixture.detectChanges();
		expect(fixture.componentInstance.borderRadius()).toBe('20px');
	});

	it('should compute border-radius as 50% for circle shape', () => {
		const fixture = TestBed.createComponent(AnimatedSkeletonLoaderComponent);
		fixture.componentRef.setInput('shape', 'circle');
		fixture.detectChanges();
		expect(fixture.componentInstance.borderRadius()).toBe('50%');
	});

	it('should reflect custom width and height inputs', () => {
		const fixture = TestBed.createComponent(AnimatedSkeletonLoaderComponent);
		fixture.componentRef.setInput('width', '100px');
		fixture.componentRef.setInput('height', '200px');
		fixture.detectChanges();
		expect(fixture.componentInstance.width()).toBe('100px');
		expect(fixture.componentInstance.height()).toBe('200px');
	});
});

// NoteBoxComponent
describe('NoteBoxComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoteBoxComponent],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(NoteBoxComponent);
		fixture.componentRef.setInput('type', 'info');
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should set info color and icon for type "info"', () => {
		const fixture = TestBed.createComponent(NoteBoxComponent);
		fixture.componentRef.setInput('type', 'info');
		fixture.detectChanges();
		expect(fixture.componentInstance.color()).toBe('var(--primary-color)');
		expect(fixture.componentInstance.icon()).toBe('info');
	});

	it('should set warn color and icon for type "warn"', () => {
		const fixture = TestBed.createComponent(NoteBoxComponent);
		fixture.componentRef.setInput('type', 'warn');
		fixture.detectChanges();
		expect(fixture.componentInstance.color()).toBe('var(--warn-color)');
		expect(fixture.componentInstance.icon()).toBe('warning');
	});

	it('should set error color and icon for type "error"', () => {
		const fixture = TestBed.createComponent(NoteBoxComponent);
		fixture.componentRef.setInput('type', 'error');
		fixture.detectChanges();
		expect(fixture.componentInstance.color()).toBe('var(--error-color)');
		expect(fixture.componentInstance.icon()).toBe('error');
	});

	it('should render mat-icon with the computed icon value', () => {
		const fixture = TestBed.createComponent(NoteBoxComponent);
		fixture.componentRef.setInput('type', 'warn');
		fixture.detectChanges();
		expect(getNoteIcon(fixture.nativeElement)!.textContent!.trim()).toBe('warning');
	});
});

// ─── InputClearButtonComponent ──────────────────────────────────────────────
describe('InputClearButtonComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [InputClearButtonComponent],
			providers: [provideNoopAnimations()],
		}).compileComponents();
	});

	it('should create', () => {
		const control = new FormControl('');
		const fixture = TestBed.createComponent(InputClearButtonComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should show the clear button when control has a value', () => {
		const control = new FormControl('some text');
		const fixture = TestBed.createComponent(InputClearButtonComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(getClearBtn(fixture.nativeElement)).toBeTruthy();
	});

	it('should hide the clear button when control is empty', () => {
		const control = new FormControl('');
		const fixture = TestBed.createComponent(InputClearButtonComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(getClearBtn(fixture.nativeElement)).toBeNull();
	});

	it('should reset the control value to null when clear() is called', () => {
		const control = new FormControl('hello');
		const fixture = TestBed.createComponent(InputClearButtonComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		fixture.componentInstance.clear();
		expect(control.value).toBeNull();
	});

	it('should set control to null when clear() is called and control has a defaultValue', () => {
		const control = new FormControl('hello', { nonNullable: false });
		(control as FormControl & { defaultValue: string | null }).defaultValue = 'default';
		const fixture = TestBed.createComponent(InputClearButtonComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		fixture.componentInstance.clear();
		expect(control.value).toBeNull();
	});

	it('should result in a null/empty value after clear(), making the button conditionally hidden', () => {
		const control = new FormControl('hello');
		const fixture = TestBed.createComponent(InputClearButtonComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		fixture.componentInstance.clear();
		// In zoneless mode we verify the model value — the @if(control().value) will be falsy
		expect(control.value == null || control.value === '').toBeTrue();
	});
});

// ButtonComponent
describe('ButtonComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ButtonComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: DisplaySizeService, useValue: mockDisplay },
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should render an icon button when iconButton is true', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		fixture.componentRef.setInput('iconButton', true);
		fixture.componentRef.setInput('matIcon', 'close');
		fixture.detectChanges();
		expect(getIconBtn(fixture.nativeElement)).toBeTruthy();
		expect(getRegularBtn(fixture.nativeElement)).toBeNull();
	});

	it('should not render an icon button when iconButton is false', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		fixture.componentRef.setInput('iconButton', false);
		fixture.detectChanges();
		expect(getIconBtn(fixture.nativeElement)).toBeNull();
		expect(getRegularBtn(fixture.nativeElement)).toBeTruthy();
	});

	it('should return "outlined" appearance when outlined input is true', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		fixture.componentRef.setInput('outlined', true);
		fixture.detectChanges();
		expect(fixture.componentInstance.appearance).toBe('outlined');
	});

	it('should return "text" appearance when text input is true', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		fixture.componentRef.setInput('text', true);
		fixture.detectChanges();
		expect(fixture.componentInstance.appearance).toBe('text');
	});

	it('should return "filled" appearance by default', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.appearance).toBe('filled');
	});

	it('should disable the button when disabled input is true', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		fixture.componentRef.setInput('disabled', true);
		fixture.detectChanges();
		expect(getNativeBtn(fixture.nativeElement)!.disabled).toBeTrue();
	});
});

// ValidatorComponent
describe('ValidatorComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ValidatorComponent],
			providers: [{ provide: TranslocoService, useValue: mockTransloco }],
		}).compileComponents();
	});

	it('should create', () => {
		const control = new FormControl('', Validators.required);
		const fixture = TestBed.createComponent(ValidatorComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should show no error when control is valid', () => {
		const control = new FormControl('value', Validators.required);
		const fixture = TestBed.createComponent(ValidatorComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(fixture.componentInstance.errorKey()).toBe('');
	});

	it('should show "required" error key when control has required error', () => {
		const control = new FormControl('', Validators.required);
		control.markAsDirty();
		const fixture = TestBed.createComponent(ValidatorComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(fixture.componentInstance.errorKey()).toBe('required');
	});

	it('should update error key when control transitions from valid to invalid', () => {
		const control = new FormControl('initial value', Validators.required);
		const fixture = TestBed.createComponent(ValidatorComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(fixture.componentInstance.errorKey()).toBe('');
		control.setValue('');
		control.updateValueAndValidity();
		expect(fixture.componentInstance.errorKey()).toBe('required');
	});

	it('should show "minlength" error key and store required length', () => {
		const control = new FormControl('ab', Validators.minLength(5));
		control.markAsDirty();
		const fixture = TestBed.createComponent(ValidatorComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(fixture.componentInstance.errorKey()).toBe('minlength');
		expect(fixture.componentInstance.errorValue()?.requiredLength).toBe(5);
	});

	it('should clear error when control becomes valid', () => {
		const control = new FormControl('', Validators.required);
		control.markAsDirty();
		const fixture = TestBed.createComponent(ValidatorComponent);
		fixture.componentRef.setInput('control', control);
		fixture.detectChanges();
		expect(fixture.componentInstance.errorKey()).toBe('required');
		control.setValue('valid value');
		expect(fixture.componentInstance.errorKey()).toBe('');
	});
});

// ShowPasswordComponent
describe('ShowPasswordComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ShowPasswordComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: DisplaySizeService, useValue: mockDisplay },
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		}).compileComponents();
	});

	it('should create', () => {
		const control = new FormControl('');
		const fixture = TestBed.createComponent(ShowPasswordComponent);
		fixture.componentRef.setInput('control', control);
		fixture.componentRef.setInput('showPassword', false);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should not render the button when control has no value', () => {
		const control = new FormControl('');
		const fixture = TestBed.createComponent(ShowPasswordComponent);
		fixture.componentRef.setInput('control', control);
		fixture.componentRef.setInput('showPassword', false);
		fixture.detectChanges();
		expect(getTogglePasswordBtn(fixture.nativeElement)).toBeNull();
	});

	it('should render the button when control has a value', () => {
		const control = new FormControl('secret');
		const fixture = TestBed.createComponent(ShowPasswordComponent);
		fixture.componentRef.setInput('control', control);
		fixture.componentRef.setInput('showPassword', false);
		fixture.detectChanges();
		expect(getTogglePasswordBtn(fixture.nativeElement)).toBeTruthy();
	});

	it('should emit toggled when the button is clicked', () => {
		const control = new FormControl('secret');
		const fixture = TestBed.createComponent(ShowPasswordComponent);
		fixture.componentRef.setInput('control', control);
		fixture.componentRef.setInput('showPassword', false);
		fixture.detectChanges();
		let emitted = false;
		fixture.componentInstance.toggled.subscribe(() => (emitted = true));
		clickTogglePasswordBtn(fixture.nativeElement);
		expect(emitted).toBeTrue();
	});

	it('should compute "passwordVisibility.hide" translation code when showPassword is true', () => {
		const control = new FormControl('secret');
		const fixture = TestBed.createComponent(ShowPasswordComponent);
		fixture.componentRef.setInput('control', control);
		fixture.componentRef.setInput('showPassword', true);
		fixture.detectChanges();
		expect(fixture.componentInstance.codeForTogglePassword()).toBe('passwordVisibility.hide');
	});

	it('should compute "passwordVisibility.show" translation code when showPassword is false', () => {
		const control = new FormControl('secret');
		const fixture = TestBed.createComponent(ShowPasswordComponent);
		fixture.componentRef.setInput('control', control);
		fixture.componentRef.setInput('showPassword', false);
		fixture.detectChanges();
		expect(fixture.componentInstance.codeForTogglePassword()).toBe('passwordVisibility.show');
	});
});

// DialogCardComponent
describe('DialogCardComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogCardComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: DisplaySizeService, useValue: mockDisplay },
				{ provide: TranslocoService, useValue: mockTransloco },
				{ provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
			],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(DialogCardComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should render a close button by default', () => {
		const fixture = TestBed.createComponent(DialogCardComponent);
		fixture.detectChanges();
		expect(getCloseBtn(fixture.nativeElement)).toBeTruthy();
	});

	it('should hide the close button when hideCloseButton is true', () => {
		const fixture = TestBed.createComponent(DialogCardComponent);
		fixture.componentRef.setInput('hideCloseButton', true);
		fixture.detectChanges();
		expect(getCloseBtn(fixture.nativeElement)).toBeNull();
	});

	it('should call matDialogRef.close() when onCloseClick is called', () => {
		const fixture = TestBed.createComponent(DialogCardComponent);
		fixture.detectChanges();
		const dialogRef = TestBed.inject(MatDialogRef);
		fixture.componentInstance.onCloseClick();
		expect(dialogRef.close).toHaveBeenCalled();
	});
});

// SnackbarComponent
describe('SnackbarComponent', () => {
	let mockSnackbarRef: jasmine.SpyObj<MatSnackBarRef<SnackbarComponent>>;

	const makeSnackbarData = (type: SnackbarType, message = 'Test message'): SnackbarData => ({
		message,
		type,
	});

	function setupModule(data: SnackbarData): void {
		mockSnackbarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss', 'afterOpened', 'afterDismissed']);
		mockSnackbarRef.afterOpened.and.returnValue(EMPTY as Observable<void>);
		mockSnackbarRef.afterDismissed.and.returnValue(EMPTY as Observable<MatSnackBarDismiss>);

		TestBed.configureTestingModule({
			imports: [SnackbarComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: MatSnackBarRef, useValue: mockSnackbarRef },
				{ provide: MAT_SNACK_BAR_DATA, useValue: data },
			],
		});
	}

	it('should create', () => {
		setupModule(makeSnackbarData(SnackbarType.Info));
		TestBed.compileComponents();
		const fixture = TestBed.createComponent(SnackbarComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should call dismiss when onClose is called', () => {
		setupModule(makeSnackbarData(SnackbarType.Error));
		TestBed.compileComponents();
		const fixture = TestBed.createComponent(SnackbarComponent);
		fixture.detectChanges();
		fixture.componentInstance.onClose();
		expect(mockSnackbarRef.dismiss).toHaveBeenCalled();
	});

	it('should return "notification-error" CSS class for Error type', () => {
		setupModule(makeSnackbarData(SnackbarType.Error));
		TestBed.compileComponents();
		const fixture = TestBed.createComponent(SnackbarComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.getCssClass()).toBe('notification-error');
	});

	it('should return "notification-warning" CSS class for Warning type', () => {
		setupModule(makeSnackbarData(SnackbarType.Warning));
		TestBed.compileComponents();
		const fixture = TestBed.createComponent(SnackbarComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.getCssClass()).toBe('notification-warning');
	});

	it('should return "notification-success" CSS class for Success type', () => {
		setupModule(makeSnackbarData(SnackbarType.Success));
		TestBed.compileComponents();
		const fixture = TestBed.createComponent(SnackbarComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.getCssClass()).toBe('notification-success');
	});

	it('should return "notification-info" CSS class for Info type', () => {
		setupModule(makeSnackbarData(SnackbarType.Info));
		TestBed.compileComponents();
		const fixture = TestBed.createComponent(SnackbarComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.getCssClass()).toBe('notification-info');
	});
});

// MessageDialogComponent
describe('MessageDialogComponent', () => {
	function makeDialogRef(data: MessageDialogData): DialogRef<MessageDialogData, boolean> {
		return new DialogRef<MessageDialogData, boolean>(() => {}, data);
	}

	beforeEach(async () => {
		const dialogData: MessageDialogData = {
			title: 'Confirm Action',
			message: 'Are you sure?',
			hideCloseIcon: false,
			buttons: MessageDialogButtonConfig.okCancel,
		};

		await TestBed.configureTestingModule({
			imports: [MessageDialogComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: DisplaySizeService, useValue: mockDisplay },
				{ provide: TranslocoService, useValue: mockTransloco },
				{ provide: DialogRef, useValue: makeDialogRef(dialogData) },
				{ provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
			],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(MessageDialogComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should render the dialog title', () => {
		const fixture = TestBed.createComponent(MessageDialogComponent);
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('Confirm Action');
	});

	it('should render the dialog message', () => {
		const fixture = TestBed.createComponent(MessageDialogComponent);
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('Are you sure?');
	});

	it('should render two action buttons for okCancel config', () => {
		const fixture = TestBed.createComponent(MessageDialogComponent);
		fixture.detectChanges();
		expect(getAllActionBtns(fixture.nativeElement).length).toBe(2);
	});

	it('should use okCancel buttons as default when no buttons are specified', () => {
		const dialogData: MessageDialogData = {
			title: 'Test',
			message: 'Msg',
			hideCloseIcon: false,
		};
		TestBed.overrideProvider(DialogRef, { useValue: makeDialogRef(dialogData) });
		const fixture = TestBed.createComponent(MessageDialogComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance.actions.buttons.length).toBe(2);
	});
});

// InfoButtonComponent
describe('InfoButtonComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [InfoButtonComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: DisplaySizeService, useValue: mockDisplay },
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(InfoButtonComponent);
		fixture.componentRef.setInput('tooltip', 'Some info');
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should render an ex-button', () => {
		const fixture = TestBed.createComponent(InfoButtonComponent);
		fixture.componentRef.setInput('tooltip', 'Some info');
		fixture.detectChanges();
		expect(getInfoBtn(fixture.nativeElement)).toBeTruthy();
	});

	it('should apply corner positioning class when block is false', () => {
		const fixture = TestBed.createComponent(InfoButtonComponent);
		fixture.componentRef.setInput('tooltip', 'Some info');
		fixture.componentRef.setInput('block', false);
		fixture.detectChanges();
		expect(fixture.nativeElement.classList.contains('corner')).toBeTrue();
	});

	it('should not apply corner positioning class when block is true', () => {
		const fixture = TestBed.createComponent(InfoButtonComponent);
		fixture.componentRef.setInput('tooltip', 'Some info');
		fixture.componentRef.setInput('block', true);
		fixture.detectChanges();
		expect(fixture.nativeElement.classList.contains('corner')).toBeFalse();
	});
});
