import { Component, DestroyRef, ElementRef, afterNextRender, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import EasyMDE from 'easymde';

@Component({
	selector: 'ex-markdown-editor',
	template: `<textarea></textarea>`,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MarkdownEditorComponent),
			multi: true,
		},
	],
})
export class MarkdownEditorComponent implements ControlValueAccessor {
	private readonly el = inject(ElementRef<HTMLElement>);
	private readonly destroyRef = inject(DestroyRef);
	private easyMDE: EasyMDE | undefined;
	private pendingValue: string | undefined;
	private pendingDisabled: boolean | undefined;

	constructor() {
		afterNextRender(() => {
			const textarea = this.el.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
			this.easyMDE = new EasyMDE({
				element: textarea,
				toolbar: [
					'bold',
					'italic',
					'heading',
					'|',
					'quote',
					'unordered-list',
					'ordered-list',
					'|',
					'link',
					'image',
					'|',
					'preview',
					'|',
					'guide',
				],
			});

			if (this.pendingValue !== undefined) {
				this.easyMDE.value(this.pendingValue);
				this.pendingValue = undefined;
			}

			if (this.pendingDisabled !== undefined) {
				this.easyMDE.codemirror.setOption('readOnly', this.pendingDisabled ? 'nocursor' : false);
				this.pendingDisabled = undefined;
			}

			this.easyMDE.codemirror.on('change', () => {
				this.onChange(this.easyMDE!.value());
			});

			this.easyMDE.codemirror.on('blur', () => {
				this.onTouched();
			});
		});

		this.destroyRef.onDestroy(() => {
			this.easyMDE?.toTextArea();
			this.easyMDE = undefined;
		});
	}

	writeValue(value: string): void {
		const normalized = value;
		if (this.easyMDE) {
			this.easyMDE.value(normalized);
		} else {
			this.pendingValue = normalized;
		}
	}

	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		if (this.easyMDE) {
			this.easyMDE.codemirror.setOption('readOnly', isDisabled ? 'nocursor' : false);
		} else {
			this.pendingDisabled = isDisabled;
		}
	}

	private onChange: (value: string) => void = () => {};
	private onTouched: () => void = () => {};
}
