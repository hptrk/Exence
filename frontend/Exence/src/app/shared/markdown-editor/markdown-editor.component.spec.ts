import { TestBed } from '@angular/core/testing';
import { MarkdownEditorComponent } from './markdown-editor.component';

describe('MarkdownEditorComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MarkdownEditorComponent],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(MarkdownEditorComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should buffer writeValue when called before EasyMDE initializes', () => {
		const fixture = TestBed.createComponent(MarkdownEditorComponent);
		const component = fixture.componentInstance;
		// writeValue before detectChanges — EasyMDE not yet initialized
		component.writeValue('# Hello world');
		// eslint-disable-next-line
		expect((component as any).pendingValue).toBe('# Hello world');
	});

	it('should store registerOnChange callback', () => {
		const fixture = TestBed.createComponent(MarkdownEditorComponent);
		const component = fixture.componentInstance;
		const fn = jasmine.createSpy('onChange');
		component.registerOnChange(fn);
		// eslint-disable-next-line
		expect((component as any).onChange).toBe(fn);
	});

	it('should store registerOnTouched callback', () => {
		const fixture = TestBed.createComponent(MarkdownEditorComponent);
		const component = fixture.componentInstance;
		const fn = jasmine.createSpy('onTouched');
		component.registerOnTouched(fn);
		// eslint-disable-next-line
		expect((component as any).onTouched).toBe(fn);
	});

	it('should normalize null/undefined writeValue to empty string', () => {
		const fixture = TestBed.createComponent(MarkdownEditorComponent);
		const component = fixture.componentInstance;
		// eslint-disable-next-line
		component.writeValue(null as any);
		// eslint-disable-next-line
		expect((component as any).pendingValue).toBe('');
	});

	it('should buffer setDisabledState when called before EasyMDE initializes', () => {
		const fixture = TestBed.createComponent(MarkdownEditorComponent);
		const component = fixture.componentInstance;
		component.setDisabledState(true);
		// eslint-disable-next-line
		expect((component as any).pendingDisabled).toBe(true);
	});
});
