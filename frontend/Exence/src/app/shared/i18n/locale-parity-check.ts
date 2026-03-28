import en from '../../../assets/i18n/en.json';
import hu from '../../../assets/i18n/hu.json';
import de from '../../../assets/i18n/de.json';

/**
 * Locale parity check — compile-time enforcement that hu.json and de.json
 * contain all the same keys as en.json (the source of truth).
 *
 * This file produces a TypeScript compile error if any locale is missing
 * a key that exists in en.json. It does not need to be imported anywhere —
 * it just needs to be included in your tsconfig compilation.
 *
 * HOW IT WORKS:
 * StringifyLeaves<T> maps every leaf of en.json to `string` and every branch
 * to its recursive equivalent, producing the exact required shape. Assigning
 * hu/de to that type causes TypeScript to report any missing key directly.
 */
type StringifyLeaves<T> = {
	[K in keyof T]: T[K] extends object ? StringifyLeaves<T[K]> : string;
};

export const _checkHu: StringifyLeaves<typeof en> = hu;
export const _checkDe: StringifyLeaves<typeof en> = de;
