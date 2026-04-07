import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RecurrenceFrequency } from '../data-model/modules/transaction/RecurrenceFrequency';
import { EndCondition } from '../data-model/modules/transaction/EndCondition';

const passwordRegex = {
	hasUppercase: /[A-Z]/,
	hasLowercase: /[a-z]/,
	hasNumber: /[0-9]/,
	hasSpecialCharacter: /.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*/,
	hasNoLeadingOrTrailingWhitespace: /^\S.*\S$/,
	lengthInterval: /^.{8,100}$/,
};

export class ExtraValidators {
	static passwordMatch =
		(controlNameToMatch: string): ValidatorFn =>
		(control: AbstractControl): ValidationErrors | null => {
			if (!control.parent) return null;
			const controlToMatch = control.parent.get(controlNameToMatch);
			if (!controlToMatch) return null;
			return control.value !== controlToMatch.value && control.value ? { passwordMismatch: true } : null;
		};

	static password(control: AbstractControl): ValidationErrors | null {
		if (!control.value) return null;
		const value: string = control.value as string;

		const pass =
			passwordRegex.hasUppercase.test(value) &&
			passwordRegex.hasLowercase.test(value) &&
			passwordRegex.hasNumber.test(value) &&
			passwordRegex.hasSpecialCharacter.test(value) &&
			passwordRegex.hasNoLeadingOrTrailingWhitespace.test(value) &&
			passwordRegex.lengthInterval.test(value);
		return pass ? null : { password: true };
	}

	static filledArray(control: AbstractControl): ValidationErrors | null {
		const value = control.value;
		return Array.isArray(value) && value.length > 0 ? null : { filledArray: true };
	}

	static theme(control: AbstractControl): ValidationErrors | null {
		const group = control as FormGroup;
		const values = Object.values(group.controls).map(c => c.value);
		const hasDuplicate = values.length !== new Set(values).size;
		return hasDuplicate ? { theme: true } : null;
	}

	static dayOfWeekRequiredForWeekly(control: AbstractControl): ValidationErrors | null {
		const group = control as FormGroup;
		const frequency = group.get('frequency')?.value as RecurrenceFrequency | null;
		const dayOfWeek = group.get('dayOfWeek')?.value;
		if (frequency === RecurrenceFrequency.WEEKLY && !dayOfWeek) {
			return { dayOfWeekRequired: true };
		}
		return null;
	}

	static dayOfMonthRequiredForMonthly(control: AbstractControl): ValidationErrors | null {
		const group = control as FormGroup;
		const frequency = group.get('frequency')?.value as RecurrenceFrequency | null;
		const dayOfMonth = group.get('dayOfMonth')?.value;
		if (frequency === RecurrenceFrequency.MONTHLY && !dayOfMonth) {
			return { dayOfMonthRequired: true };
		}
		return null;
	}

	static endDateRequiredForEndCondition(control: AbstractControl): ValidationErrors | null {
		const group = control as FormGroup;
		const endCondition = group.get('endCondition')?.value as EndCondition | null;
		const endDate = group.get('endDate')?.value as Date | null;
		if (endCondition === EndCondition.UNTIL_DATE && !endDate) {
			return { endDateRequired: true };
		}
		return null;
	}
}
