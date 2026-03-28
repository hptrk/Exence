import { Component, input, OnInit, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge, of } from 'rxjs';
import { BaseComponent } from '../base-component/base.component';
import { TranslatePipe } from '../pipes/translate.pipe';

interface ErrorInfo {
	min?: number;
	max?: number;
	requiredLength?: number;
}

@Component({
	selector: 'ex-validator',
	templateUrl: './validator.component.html',
	imports: [TranslatePipe],
})
export class ValidatorComponent extends BaseComponent implements OnInit {
	control = input.required<AbstractControl>();

	errorKey = signal<string>('');
	errorValue = signal<ErrorInfo | null>(null);

	ngOnInit(): void {
		this.addSubscription(
			merge(of(this.control().dirty), this.control().statusChanges).subscribe(() => {
				if (!this.control().errors) {
					this.errorKey.set('');
					this.errorValue.set(null);
					return;
				}
				this.errorKey.set(Object.keys(this.control().errors!)[0]);
				this.errorValue.set(this.control().errors![this.errorKey()] as ErrorInfo);
			}),
		);
	}
}
