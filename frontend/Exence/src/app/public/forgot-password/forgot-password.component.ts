import { Component, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ButtonComponent } from "../../shared/button/button.component";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { BaseComponent } from "../../shared/base-component/base.component";

@Component({
	selector: 'ex-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
	imports: [MatFormFieldModule, MatInputModule, ButtonComponent, ReactiveFormsModule, MatCardModule, MatIconModule]
})
export class ForgotPasswordComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);

	emailControl = this.fb.control<string | null>(null, [Validators.required, Validators.email, Validators.maxLength(255)])
}