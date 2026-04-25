import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DialogRef, DialogService } from '../../../app/shared/dialog/dialog.service';

describe('DialogRef', () => {
	let onClose: jasmine.Spy;

	function makeRef<O = void>(value: unknown = undefined): DialogRef<unknown, O> {
		return new DialogRef<unknown, O>(onClose, value);
	}

	beforeEach(() => {
		onClose = jasmine.createSpy('onClose');
	});

	it('isLocked is initially false', () => {
		expect(makeRef().isLocked).toBeFalse();
	});

	it('value is set from the constructor argument', () => {
		const ref = new DialogRef(onClose, { data: 42 });
		expect(ref.value).toEqual({ data: 42 });
	});

	it('setLocked(true) sets isLocked to true', () => {
		const ref = makeRef();
		ref.setLocked(true);
		expect(ref.isLocked).toBeTrue();
	});

	it('setLocked(false) after locking sets isLocked back to false', () => {
		const ref = makeRef();
		ref.setLocked(true);
		ref.setLocked(false);
		expect(ref.isLocked).toBeFalse();
	});

	it('close() when not locked calls onClose with the provided value', async () => {
		const ref = makeRef<string>();
		await ref.close('result' as never);
		expect(onClose).toHaveBeenCalledOnceWith('result');
	});

	it('close() when locked and no callback set does not call onClose', async () => {
		const ref = makeRef<string>();
		ref.setLocked(true);
		await ref.close('result' as never);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('close() when locked with callback resolving true calls onClose and unlocks', async () => {
		const ref = makeRef<string>();
		ref.setLocked(true);
		ref.setOnCloseAttemptWhileLocked(() => Promise.resolve(true));
		await ref.close('result' as never);
		expect(onClose).toHaveBeenCalledOnceWith('result');
		expect(ref.isLocked).toBeFalse();
	});

	it('close() when locked with callback resolving false does not call onClose and remains locked', async () => {
		const ref = makeRef<string>();
		ref.setLocked(true);
		ref.setOnCloseAttemptWhileLocked(() => Promise.resolve(false));
		await ref.close('result' as never);
		expect(onClose).not.toHaveBeenCalled();
		expect(ref.isLocked).toBeTrue();
	});

	it('submit() calls onClose even when locked', () => {
		const ref = makeRef<string>();
		ref.setLocked(true);
		ref.submit('submitted' as never);
		expect(onClose).toHaveBeenCalledOnceWith('submitted');
	});

	it('submit() sets isLocked to false', () => {
		const ref = makeRef<string>();
		ref.setLocked(true);
		ref.submit('submitted' as never);
		expect(ref.isLocked).toBeFalse();
	});
});

// ---------------------------------------------------------------------------
// Minimal stub component used as dialog target in DialogService tests
// ---------------------------------------------------------------------------
@Component({ template: '', standalone: true })
class StubDialogComponent extends Object {}

describe('DialogService', () => {
	let service: DialogService;
	let afterClosed$: Subject<unknown>;
	let backdropClick$: Subject<void>;
	let mockMatDialogRef: {
		close: jasmine.Spy;
		disableClose: boolean | undefined;
		afterClosed: () => Subject<unknown>;
		backdropClick: () => Subject<void>;
	};
	let openSpy: jasmine.Spy;

	beforeEach(() => {
		afterClosed$ = new Subject<unknown>();
		backdropClick$ = new Subject<void>();

		mockMatDialogRef = {
			close: jasmine.createSpy('matDialogRef.close'),
			disableClose: undefined,
			afterClosed: () => afterClosed$,
			backdropClick: () => backdropClick$,
		};

		openSpy = jasmine.createSpy('matDialog.open').and.returnValue(mockMatDialogRef);

		TestBed.configureTestingModule({
			providers: [
				DialogService,
				{ provide: MatDialog, useValue: { open: openSpy } },
			],
		});

		service = TestBed.inject(DialogService);
	});

	it('openModal sets disableClose to true on the MatDialog config', () => {
		service.openModal(StubDialogComponent, undefined);

		expect(openSpy).toHaveBeenCalledTimes(1);
		const config = openSpy.calls.mostRecent().args[1] as { disableClose: unknown };
		expect(config.disableClose).toBeTrue();
	});

	it('openNonModal sets disableClose to false on the MatDialog config', () => {
		service.openNonModal(StubDialogComponent, undefined);

		expect(openSpy).toHaveBeenCalledTimes(1);
		const config = openSpy.calls.mostRecent().args[1] as { disableClose: unknown };
		expect(config.disableClose).toBeFalse();
	});

	it('open resolves the returned promise with the value emitted by afterClosed', async () => {
		const promise = service.openModal<undefined, string>(StubDialogComponent, undefined);

		afterClosed$.next('dialog-result');
		afterClosed$.complete();

		const result = await promise;
		expect(result).toBe('dialog-result');
	});

	it('MatDialog.open is called once with the correct component', () => {
		service.openModal(StubDialogComponent, undefined);

		expect(openSpy).toHaveBeenCalledTimes(1);
		expect(openSpy.calls.mostRecent().args[0]).toBe(StubDialogComponent);
	});
});
