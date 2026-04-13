import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { EndCondition } from '../../../app/data-model/modules/transaction/EndCondition';
import { RecurrenceFrequency } from '../../../app/data-model/modules/transaction/RecurrenceFrequency';
import { ExtraValidators } from '../../../app/shared/validators';
import { validatorData } from '../data/validators.data';

function ctrl(value: unknown): AbstractControl {
	return new FormControl(value);
}

// ExtraValidators.password
describe('ExtraValidators.password', () => {
	it('returns null for empty value (required is a separate concern)', () => {
		for (const value of validatorData.password.empty) {
			expect(ExtraValidators.password(ctrl(value))).toBeNull();
		}
	});

	it('returns null for valid passwords', () => {
		for (const value of validatorData.password.valid) {
			expect(ExtraValidators.password(ctrl(value))).toBeNull();
		}
	});

	it('returns { password: true } when uppercase is missing', () => {
		for (const value of validatorData.password.missingUppercase) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});

	it('returns { password: true } when lowercase is missing', () => {
		for (const value of validatorData.password.missingLowercase) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});

	it('returns { password: true } when digit is missing', () => {
		for (const value of validatorData.password.missingDigit) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});

	it('returns { password: true } when special character is missing', () => {
		for (const value of validatorData.password.missingSpecial) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});

	it('returns { password: true } when shorter than 8 characters', () => {
		for (const value of validatorData.password.tooShort) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});

	it('returns { password: true } when longer than 100 characters', () => {
		for (const value of validatorData.password.tooLong) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});

	it('returns { password: true } when leading whitespace is present', () => {
		for (const value of validatorData.password.leadingWhitespace) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});

	it('returns { password: true } when trailing whitespace is present', () => {
		for (const value of validatorData.password.trailingWhitespace) {
			expect(ExtraValidators.password(ctrl(value))).toEqual({ password: true });
		}
	});
});

// ExtraValidators.passwordMatch
describe('ExtraValidators.passwordMatch', () => {
	function buildGroup(password: string, confirmPassword: string): FormGroup {
		return new FormGroup({
			password: new FormControl(password),
			confirmPassword: new FormControl(confirmPassword),
		});
	}

	it('returns null when passwords match', () => {
		const group = buildGroup('Str0ng!Pass', 'Str0ng!Pass');
		expect(ExtraValidators.passwordMatch('password')(group.get('confirmPassword')!)).toBeNull();
	});

	it('returns { passwordMismatch: true } when passwords differ', () => {
		const group = buildGroup('Str0ng!Pass', 'Different1!');
		expect(ExtraValidators.passwordMatch('password')(group.get('confirmPassword')!)).toEqual({
			passwordMismatch: true,
		});
	});

	it('returns null when confirmPassword is empty (required is a separate concern)', () => {
		const group = buildGroup('Str0ng!Pass', '');
		expect(ExtraValidators.passwordMatch('password')(group.get('confirmPassword')!)).toBeNull();
	});

	it('returns null when control has no parent', () => {
		expect(ExtraValidators.passwordMatch('password')(ctrl('value'))).toBeNull();
	});

	it('returns null when the target control does not exist in the group', () => {
		const group = buildGroup('Str0ng!Pass', 'Str0ng!Pass');
		expect(ExtraValidators.passwordMatch('nonExistentField')(group.get('confirmPassword')!)).toBeNull();
	});
});

// ExtraValidators.filledArray
describe('ExtraValidators.filledArray', () => {
	it('returns null for a non-empty array', () => {
		expect(ExtraValidators.filledArray(ctrl(['item']))).toBeNull();
		expect(ExtraValidators.filledArray(ctrl([1, 2, 3]))).toBeNull();
	});

	it('returns { filledArray: true } for an empty array', () => {
		expect(ExtraValidators.filledArray(ctrl([]))).toEqual({ filledArray: true });
	});

	it('returns { filledArray: true } for null', () => {
		expect(ExtraValidators.filledArray(ctrl(null))).toEqual({ filledArray: true });
	});

	it('returns { filledArray: true } for non-array values', () => {
		expect(ExtraValidators.filledArray(ctrl('string'))).toEqual({ filledArray: true });
		expect(ExtraValidators.filledArray(ctrl(42))).toEqual({ filledArray: true });
	});
});

// ExtraValidators.theme
describe('ExtraValidators.theme', () => {
	it('returns null when all control values are unique', () => {
		const group = new FormGroup({
			primary: new FormControl('blue'),
			secondary: new FormControl('red'),
			accent: new FormControl('green'),
		});
		expect(ExtraValidators.theme(group)).toBeNull();
	});

	it('returns { theme: true } when duplicate values exist', () => {
		const group = new FormGroup({
			primary: new FormControl('blue'),
			secondary: new FormControl('blue'),
			accent: new FormControl('green'),
		});
		expect(ExtraValidators.theme(group)).toEqual({ theme: true });
	});

	it('returns null for a group with a single control', () => {
		const group = new FormGroup({ primary: new FormControl('blue') });
		expect(ExtraValidators.theme(group)).toBeNull();
	});
});

// ExtraValidators.dayOfWeekRequiredForWeekly
describe('ExtraValidators.dayOfWeekRequiredForWeekly', () => {
	function buildGroup(frequency: RecurrenceFrequency | null, dayOfWeek: string | null): FormGroup {
		return new FormGroup({
			frequency: new FormControl(frequency),
			dayOfWeek: new FormControl(dayOfWeek),
		});
	}

	it('returns null when frequency is WEEKLY and dayOfWeek is set', () => {
		expect(ExtraValidators.dayOfWeekRequiredForWeekly(buildGroup(RecurrenceFrequency.WEEKLY, 'MONDAY'))).toBeNull();
	});

	it('returns { dayOfWeekRequired: true } when frequency is WEEKLY and dayOfWeek is null', () => {
		expect(ExtraValidators.dayOfWeekRequiredForWeekly(buildGroup(RecurrenceFrequency.WEEKLY, null))).toEqual({
			dayOfWeekRequired: true,
		});
	});

	it('returns null when frequency is MONTHLY', () => {
		expect(ExtraValidators.dayOfWeekRequiredForWeekly(buildGroup(RecurrenceFrequency.MONTHLY, null))).toBeNull();
	});

	it('returns null when frequency is YEARLY', () => {
		expect(ExtraValidators.dayOfWeekRequiredForWeekly(buildGroup(RecurrenceFrequency.YEARLY, null))).toBeNull();
	});

	it('returns null when frequency is null', () => {
		expect(ExtraValidators.dayOfWeekRequiredForWeekly(buildGroup(null, null))).toBeNull();
	});
});

// ExtraValidators.dayOfMonthRequiredForMonthly
describe('ExtraValidators.dayOfMonthRequiredForMonthly', () => {
	function buildGroup(frequency: RecurrenceFrequency | null, dayOfMonth: number | null): FormGroup {
		return new FormGroup({
			frequency: new FormControl(frequency),
			dayOfMonth: new FormControl(dayOfMonth),
		});
	}

	it('returns null when frequency is MONTHLY and dayOfMonth is set', () => {
		expect(ExtraValidators.dayOfMonthRequiredForMonthly(buildGroup(RecurrenceFrequency.MONTHLY, 15))).toBeNull();
	});

	it('returns { dayOfMonthRequired: true } when frequency is MONTHLY and dayOfMonth is null', () => {
		expect(ExtraValidators.dayOfMonthRequiredForMonthly(buildGroup(RecurrenceFrequency.MONTHLY, null))).toEqual({
			dayOfMonthRequired: true,
		});
	});

	it('returns null when frequency is WEEKLY', () => {
		expect(ExtraValidators.dayOfMonthRequiredForMonthly(buildGroup(RecurrenceFrequency.WEEKLY, null))).toBeNull();
	});

	it('returns null when frequency is null', () => {
		expect(ExtraValidators.dayOfMonthRequiredForMonthly(buildGroup(null, null))).toBeNull();
	});
});

// ExtraValidators.endDateRequiredForEndCondition
describe('ExtraValidators.endDateRequiredForEndCondition', () => {
	function buildGroup(endCondition: EndCondition | null, endDate: Date | null): FormGroup {
		return new FormGroup({
			endCondition: new FormControl(endCondition),
			endDate: new FormControl(endDate),
		});
	}

	it('returns null when endCondition is UNTIL_DATE and endDate is set', () => {
		expect(
			ExtraValidators.endDateRequiredForEndCondition(buildGroup(EndCondition.UNTIL_DATE, new Date('2025-12-31'))),
		).toBeNull();
	});

	it('returns { endDateRequired: true } when endCondition is UNTIL_DATE and endDate is null', () => {
		expect(ExtraValidators.endDateRequiredForEndCondition(buildGroup(EndCondition.UNTIL_DATE, null))).toEqual({
			endDateRequired: true,
		});
	});

	it('returns null when endCondition is NEVER', () => {
		expect(ExtraValidators.endDateRequiredForEndCondition(buildGroup(EndCondition.NEVER, null))).toBeNull();
	});

	it('returns null when endCondition is AFTER_OCCURRENCES', () => {
		expect(
			ExtraValidators.endDateRequiredForEndCondition(buildGroup(EndCondition.AFTER_OCCURRENCES, null)),
		).toBeNull();
	});

	it('returns null when endCondition is null', () => {
		expect(ExtraValidators.endDateRequiredForEndCondition(buildGroup(null, null))).toBeNull();
	});
});

// ExtraValidators.initialAmountMax
describe('ExtraValidators.initialAmountMax', () => {
	function buildGroup(targetAmount: number | null, initialAmount: number | null): FormGroup {
		return new FormGroup({
			targetAmount: new FormControl(targetAmount),
			initialAmount: new FormControl(initialAmount),
		});
	}

	it('returns null when initialAmount is less than targetAmount', () => {
		expect(ExtraValidators.initialAmountMax(buildGroup(1000, 500))).toBeNull();
	});

	it('returns null when initialAmount equals targetAmount', () => {
		expect(ExtraValidators.initialAmountMax(buildGroup(1000, 1000))).toBeNull();
	});

	it('returns { initialAmountMax: true } when initialAmount exceeds targetAmount', () => {
		expect(ExtraValidators.initialAmountMax(buildGroup(500, 1000))).toEqual({
			initialAmountMax: true,
		});
	});

	it('returns null when targetAmount is null', () => {
		expect(ExtraValidators.initialAmountMax(buildGroup(null, 500))).toBeNull();
	});

	it('returns null when initialAmount is null', () => {
		expect(ExtraValidators.initialAmountMax(buildGroup(1000, null))).toBeNull();
	});

	it('returns null when both values are null', () => {
		expect(ExtraValidators.initialAmountMax(buildGroup(null, null))).toBeNull();
	});
});

// ExtraValidators.currentAmountMax
describe('ExtraValidators.currentAmountMax', () => {
	function buildGroup(targetAmount: number | null, currentAmount: number | null): FormGroup {
		return new FormGroup({
			targetAmount: new FormControl(targetAmount),
			currentAmount: new FormControl(currentAmount),
		});
	}

	it('returns null when currentAmount is less than targetAmount', () => {
		expect(ExtraValidators.currentAmountMax(buildGroup(1000, 500))).toBeNull();
	});

	it('returns null when currentAmount equals targetAmount', () => {
		expect(ExtraValidators.currentAmountMax(buildGroup(1000, 1000))).toBeNull();
	});

	it('returns { currentAmountMax: true } when currentAmount exceeds targetAmount', () => {
		expect(ExtraValidators.currentAmountMax(buildGroup(500, 1000))).toEqual({
			currentAmountMax: true,
		});
	});

	it('returns null when targetAmount is null', () => {
		expect(ExtraValidators.currentAmountMax(buildGroup(null, 500))).toBeNull();
	});

	it('returns null when currentAmount is null', () => {
		expect(ExtraValidators.currentAmountMax(buildGroup(1000, null))).toBeNull();
	});
});

// ExtraValidators.fieldNotLessThan
describe('ExtraValidators.fieldNotLessThan', () => {
	const validate = ExtraValidators.fieldNotLessThan('amount', 'minAmount');

	function buildGroup(fieldValue: number | null, minFieldValue: number | null): FormGroup {
		return new FormGroup({
			amount: new FormControl(fieldValue),
			minAmount: new FormControl(minFieldValue),
		});
	}

	it('returns null when field value is greater than min field value', () => {
		expect(validate(buildGroup(100, 50))).toBeNull();
	});

	it('returns null when field value equals min field value', () => {
		expect(validate(buildGroup(50, 50))).toBeNull();
	});

	it('returns { fieldNotLessThan: true } when field value is less than min field value', () => {
		expect(validate(buildGroup(10, 50))).toEqual({ fieldNotLessThan: true });
	});

	it('returns null when field value is null', () => {
		expect(validate(buildGroup(null, 50))).toBeNull();
	});

	it('returns null when min field value is null', () => {
		expect(validate(buildGroup(10, null))).toBeNull();
	});

	it('returns null when both values are null', () => {
		expect(validate(buildGroup(null, null))).toBeNull();
	});
});
