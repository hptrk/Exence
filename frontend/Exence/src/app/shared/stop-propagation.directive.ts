import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({
	selector: '[stopPropagation]'
})
export class StopPropagationDirective {
	private readonly element = inject(ElementRef);
	private readonly renderer = inject(Renderer2);

	readonly events = input<string | string[]>(['click']);

	constructor() {
		effect(onCleanup => {
			const events = this.events();
			const eventList = Array.isArray(events) ? events : [events];

			const unlisteners = eventList.map(eventName => 
				this.renderer.listen(
					this.element.nativeElement,
					eventName,
					(event: Event) => event.stopPropagation()
				)
			);

			onCleanup(() => {
				unlisteners.forEach(unlisten => unlisten());
			});
		});
	}
}