export const validatorData = {
	password: {
		valid: ['Str0ng!Pass', 'Abcde1!fg', 'MyP@ss1word'],
		missingUppercase: ['weak1!pass', 'abc1!def'],
		missingLowercase: ['WEAK1!PASS', 'ABC1!DEF'],
		missingDigit: ['Weak!Pass', 'StrongPass!'],
		missingSpecial: ['Weak1Pass', 'Strong1Pass'],
		tooShort: ['Str0ng!'],
		tooLong: ['Str0ng!P' + 'a'.repeat(93)],
		leadingWhitespace: [' Str0ng!Pass'],
		trailingWhitespace: ['Str0ng!Pass '],
		empty: ['', null],
	},
};
