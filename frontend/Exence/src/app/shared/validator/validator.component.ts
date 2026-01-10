import { Component, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge, of } from 'rxjs';
import { BaseComponent } from '../base-component/base.component';

interface ErrorInfo {
	min?: number;
	max?: number;
	requiredLength?: number;
}

@Component({
	selector: 'ex-validator',
	templateUrl: './validator.component.html',
	imports: [],
})
export class ValidatorComponent extends BaseComponent implements OnInit {
	control = input.required<AbstractControl>();
	
	errorKey?: string;
	errorValue?: ErrorInfo;
	
	ngOnInit(): void {
		this.addSubscription(merge(of(this.control().dirty), this.control().statusChanges).subscribe(
			() => {
				if (!this.control().errors) return;
				this.errorKey = Object.keys(this.control().errors!)[0];
				this.errorValue = this.control().errors![this.errorKey];
			}
		));
	}
}