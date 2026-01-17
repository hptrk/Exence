import { Directive, inject, Injectable, Injector, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from '../base-component/base.component';


/**
 * Represents a reference to an open dialog instance.
 * 
 * @template I - The type of input data passed to the dialog. Default: `undefined`.
 * @template O - The type of output data returned when the dialog closes. Default: `void`.
 * 
 * @remarks
 * This class provides methods to control and interact with a dialog instance,
 * including the ability to close the dialog and lock/unlock its state.
 * 
 * @method onClose - Callback function invoked when the dialog closes, receiving the output value.
 * @method setLocked - Function to to set the locked state (availability to close the dialog) of dialog.
 * @field value - The input data passed to the dialog.
 * 
 * @example
 * ```typescript
 * const dialogRef = new DialogRef<MyInputData, MyResult>(
 *   (result) => console.log('Dialog closed with:', result),
 *   (locked) => console.log('Dialog locked state:', locked),
 *   { inputData: 'example' }
 * );
 * 
 * // Close the dialog with a result
 * dialogRef.close({ success: true });
 * 
 * // Lock the dialog to prevent closing
 * dialogRef.setLocked(true);
 * ```
 */
class DialogRef<out I = undefined, in O = void> {
	constructor(
		private onClose: (value: O) => void,
		readonly setLocked: (isLocked: boolean) => void,
		readonly value: I
	) { }

	public close(value: O): void {
		this.onClose(value);
	}
}

/**
 * Abstract base class for dialog components that provides a structured way to handle dialog interactions.
 * 
 * @template I - The input type that will be passed to the dialog when it is opened. Default: `undefined`.
 * @template O - The output type that will be returned when the dialog is closed. Default: `void`.
 * 
 * @example
 * ```typescript
 * export class ConfirmDialogComponent extends DialogComponent<ConfirmDialogData, boolean> {
 *   inputData: ConfirmDialogData = this.dialogRef.value;
 * }
 * ```
 */
@Directive()
export abstract class DialogComponent<out I = undefined, in O = void> {
	constructor(public dialogRef: DialogRef<I, O>) {}
}

/**
 * Abstract base class for dialog components that extend BaseComponent.
 * 
 * This class combines dialog functionality with the BaseComponent lifecycle management,
 * providing a foundation for creating dialog components with proper cleanup and state management.
 * 
 * @template I - The type of data passed to the dialog when opened (contravariant)
 * @template O - The type of data returned when the dialog is closed (covariant)
 * 
 * @example
 * ```typescript
 * export class MyDialogComponent extends DialogWithBaseComponent<MyDialogData, MyDialogResult> {
 *   constructor(dialogRef: DialogRef<MyDialogData, MyDialogResult>) {
 *     super(dialogRef);
 *   }
 * }
 * ```
 */
@Directive()
export abstract class DialogWithBaseComponent<out I = undefined, in O = void> extends BaseComponent {
	constructor(public dialogRef: DialogRef<I, O>) { super(); }
}

/**
 * Type definition for a component that accepts a `DialogRef<I, O>` in it's constructor.
 * 
 * @template I - The type of input data passed to the dialog
 * @template O - The type of output data returned from the dialog
 * @template T - The type of the dialog component instance,  Default: `any`.
 * 
 * @param dialogRef - Reference to the dialog instance with input and output types
 * @param rest - Additional parameters that can be injected into the dialog constructor
 * 
 * @returns A new instance of the dialog component
 */
type DialogConstructor<in I, out O, T = any> = 
	new (dialogRef: DialogRef<I, O>, ...rest: any[]) => T;


/**
 * Represents a dialog that can be opened in the application.
 * 
 * @typeParam I - The input data type passed to the dialog when it's opened
 * @typeParam O - The output data type returned when the dialog is closed
 * 
 * @remarks
 * This type supports two kinds of dialogs:
 * - `DialogConstructor<I, O>`: A custom Exence dialog type that accepts a `DialogRef<I, O> in it's constructor`.
 * - `TemplateRef<any>`: An Angular template reference that can be used to render any component as a dialog
 * 
 * @example
 * ```typescript
 * // Exence's custom dialog component
 * export class ExenceDialogComponent extends DialogComponent<string, boolean> {
 *   inputData: ExenceDialogData = this.dialogRef.value;
 * }
 * const isExenceDialog: boolean = this.dialog.open(ExenceDialogComponent, {
 *     value: 'inputString',
 *     disableClose: { defaultValue: false }
 * );
 * 
 * // Using a template reference
 * ```
 * ```html
 *     <ng-template #myTemplate>
 *       <h2>Confirm Action</h2>
 *       <p>Are you sure?</p>
 *     </ng-template>
 * ```
 * ```typescript
 * class MyComponent {
 *   myTemplateRef = viewChild<TemplateRef<any>>('myTemplate');
 *   
 *   openTemplateDialog() {
 *     const result = await this.dialogService.open(this.myTemplateRef()!, {
 *       value: undefined,
 *       disableClose: { defaultValue: false }
 *     });
 *   }
 * }
 * ```
 */
type Dialog<I, O> = DialogConstructor<I, O> | TemplateRef<any>;


/**
 * Configuration settings for Exence's custom dialogs, excluding injector and disableClose properties.
 * 
 * This type is derived from MatDialogConfig but omits the 'injector' and 'disableClose' 
 * properties, providing a simplified interface for configuring dialog behavior and appearance.
 * 
 * @remarks
 * The omitted properties:
 *  - `injector` - managed internally by the dialog service to ensure consistent behavior across the application.
 *  - `disableClose` - removed so later a `defaultValue` can be assigned that's type is equivalent to the dialog's return type
 * 
 * @see {@link https://material.angular.io/components/dialog/api#MatDialogConfig | MatDialogConfig}
 */
type DialogSettings = Omit<MatDialogConfig, 'injector' | 'disableClose'>;

@Injectable({
	providedIn: 'root'
})
export class DialogService extends BaseComponent {
	private readonly injector = inject(Injector);
	private readonly matDialog = inject(MatDialog);

	/**
	 * Opens a non-modal dialog that can be closed by clicking outside or pressing ESC. *(`dialog.close()` still closes the dialog)*
	 * 
	 * @template I - The type of input value passed to the dialog component
	 * @template O - The type of output value returned by the dialog component
	 * 
	 * @param component - The dialog component to be displayed
	 * @param value - The input value to be passed to the dialog component
	 * @param settings - Optional dialog settings to customize the dialog behavior
	 * 
	 * @returns A **Promise** that resolves to the output value when the dialog is closed, or undefined if dismissed
	 * 
	 * @remarks
	 * This method creates a dialog that can be dismissed by user actions outside the dialog itself.
	 * It internally calls the `open` method with `disableClose` set to allow closing with `undefined` as default value.
	 */
	public openNonModal<I, O>(
		component: Dialog<I, O | undefined>,
		value: I,
		settings?: DialogSettings
	): Promise<O | undefined> {
		return this.open<I, O | undefined>(
			component,
			{
				...settings,
				value,
				disableClose: { defaultValue: undefined },
			}
		);
	}

	/**
	 * Opens a modal dialog with the specified component and configuration.
	 * 
	 * @template I - The type of input data passed to the dialog component
	 * @template O - The type of output data returned from the dialog component
	 * 
	 * @param component - The dialog component to be displayed
	 * @param value - The input value to be passed to the dialog component
	 * @param settings - Configuration settings for the dialog
	 * 
	 * @returns A **Promise** that resolves with the output data when the dialog is closed.
	 * 
	 * @remarks
	 * This method creates a modal dialog that cannot be closed by clicking outside or pressing ESC.
	 * The dialog's `disableClose` property is automatically set to `true`.
	 */
	public openModal<I, O>(
		component: Dialog<I, O>,
		value: I,
		settings?: DialogSettings
	): Promise<O> {
		return this.open<I, O>(
			component,
			{
				...settings,
				value,
				disableClose: true,
			}
		);
	}

	/**
	 * Opens a dialog with the specified component and settings.
	 * 
	 * @template I - The type of the input value passed to the dialog
	 * @template O - The type of the output value returned by the dialog
	 * 
	 * @param component - The dialog component to be displayed
	 * @param settings - Configuration options for the dialog, including:
	 *   - `value`: The input value to pass to the dialog component
	 *   - `disableClose`: Either `true` to prevent closing, or an object with `defaultValue` 
	 *     that will be returned when the dialog is closed via backdrop click
	 *   - Additional MatDialog settings ({@link https://material.angular.io/components/dialog/api#MatDialogConfig | MatDialogConfig})
	 * 
	 * @returns A Promise that resolves with the dialog's output value when the dialog is closed
	 * 
	 * @remarks
	 * - When `disableClose` is `true`, the dialog cannot be closed by clicking the backdrop
	 * - When `disableClose` is an object with `defaultValue`, backdrop clicks will close the dialog
	 *   with the specified default value (unless the dialog is dynamically locked)
	 * - The dialog can be dynamically locked/unlocked during its lifetime using the DialogRef
	 * - Sets the `dialogOpened` signal to `true` when a dialog is opened
	 */
	public open<I, O>(
		component: Dialog<I, O>,
		settings: DialogSettings & { value: I; disableClose: true | { defaultValue: O } }
	): Promise<O> {
		return new Promise((resolve) => {
			let matDialogRef: MatDialogRef<any> | undefined;
			let locked = settings.disableClose === true;
			
			const dialogRef = new DialogRef<I, O>(
				(value) => matDialogRef?.close(value),
				(value) => {
					locked = value;
					matDialogRef!.disableClose = value;
				},
				settings.value,
			);

			const injector = Injector.create({
				providers: [{ provide: DialogRef, useValue: dialogRef }],
				parent: this.injector,
			});
			matDialogRef = this.matDialog.open(
				component, {
					...settings,
					maxHeight: settings.maxHeight ?? 'auto',
					maxWidth: settings.maxWidth ?? 'auto',
					height: settings.height ?? 'auto',
					disableClose: locked,
					injector,
				}
			);

			if (settings.disableClose !== true) {
				const value = settings.disableClose.defaultValue;
				this.addSubscription(matDialogRef.backdropClick().subscribe(() => {
					if (!locked) dialogRef.close(value);
				}));
			}

			firstValueFrom(matDialogRef.afterClosed()).then(resolve); // convert close to promise
		})
	}
}