import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const TYPE_MAP = {
	info: { color: 'var(--primary-color)', icon: 'info' },
	warn: { color: 'var(--warn-color)', icon: 'warning' },
	error: { color: 'var(--error-color)', icon: 'error' },
};

@Component({
	selector: 'ex-note-box',
	templateUrl: './note-box.component.html',
	styleUrl: './note-box.component.scss',
	imports: [MatIconModule],
	host: {
		'[style.--note-color]': 'color()',
	},
})
export class NoteBoxComponent {
	type = input.required<'info' | 'warn' | 'error'>();

	color = computed(() => TYPE_MAP[this.type()].color);
	icon = computed(() => TYPE_MAP[this.type()].icon);
}
