import { EnumValuePipe } from '../../../app/shared/pipes/enum-value.pipe';

enum Color {
	Red = 'RED',
	Green = 'GREEN',
	Blue = 'BLUE',
}

enum Direction {
	North = 'NORTH',
}

describe('EnumValuePipe', () => {
	let pipe: EnumValuePipe;

	beforeEach(() => {
		pipe = new EnumValuePipe();
	});

	it('returns all values of a string enum', () => {
		expect(pipe.transform(Color) as string[]).toEqual(['RED', 'GREEN', 'BLUE']);
	});

	it('returns a single-value enum correctly', () => {
		expect(pipe.transform(Direction) as string[]).toEqual(['NORTH']);
	});

	it('returns an empty array for an empty object', () => {
		expect(pipe.transform({})).toEqual([]);
	});

	it('returns values in declaration order', () => {
		const result = pipe.transform(Color) as string[];
		expect(result[0]).toBe('RED');
		expect(result[1]).toBe('GREEN');
		expect(result[2]).toBe('BLUE');
	});
});
