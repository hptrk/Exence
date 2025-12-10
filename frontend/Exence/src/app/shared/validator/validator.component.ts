import { Component, input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { BaseComponent } from "../base-component/base.component";
import { merge, of } from "rxjs";

@Component({
	selector: 'ex-validator',
	templateUrl: './validator.component.html',
	imports: [],
})
export class ValidatorComponent extends BaseComponent implements OnInit{
	control = input.required<FormControl>();
	
	errorKey?: string;
	errorValue?: any;

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