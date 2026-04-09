export const ordinalData: Record<string, { input: number; expected: string }[]> = {
	en: [
		{ input: 1, expected: '1st' },
		{ input: 2, expected: '2nd' },
		{ input: 3, expected: '3rd' },
		{ input: 4, expected: '4th' },
		{ input: 11, expected: '11th' },
		{ input: 12, expected: '12th' },
		{ input: 13, expected: '13th' },
		{ input: 21, expected: '21st' },
		{ input: 22, expected: '22nd' },
		{ input: 23, expected: '23rd' },
	],
	fr: [
		{ input: 1, expected: '1er' },
		{ input: 2, expected: '2e' },
		{ input: 15, expected: '15e' },
	],
	es: [
		{ input: 1, expected: '1.º' },
		{ input: 5, expected: '5.º' },
	],
	it: [
		{ input: 1, expected: '1°' },
		{ input: 5, expected: '5°' },
	],
	hu: [
		{ input: 1, expected: '1.' },
		{ input: 5, expected: '5.' },
	],
};
