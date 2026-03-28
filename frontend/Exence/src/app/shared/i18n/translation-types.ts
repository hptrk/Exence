import en from '../../../assets/i18n/en.json';

type En = typeof en;

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

type Category = { [key: string]: string | Category };

/**
 * Recursively maps a nested object type to all possible dot-notation leaf paths.
 * e.g. { admin: { login: { title: string } } } => 'admin.login.title'
 *
 * This is the source of TranslationCode — every valid key you can pass to the pipe.
 */
export type PropertyStringPath<T extends Category, Prefix extends string = ''> = {
	[K in keyof T]: T[K] extends Category
		? PropertyStringPath<T[K], `${Prefix}${string & K}.`>
		: `${Prefix}${string & K}`;
}[keyof T];

/**
 * All valid dot-notation translation keys derived directly from en.json.
 * Typos will be caught at compile time, and IDEs will autocomplete valid keys.
 */
export type TranslationCode = PropertyStringPath<En> | '';

// ---------------------------------------------------------------------------
// Recursive prefix -> suffix mapping for codeFor()
// ---------------------------------------------------------------------------

/**
 * Extracts all branch node paths (non-leaf paths) from a nested object,
 * mapped to their immediate leaf key children as valid suffixes.
 *
 * e.g. for { admin: { login: { title: "", subtitle: "" } } }
 * produces: { 'admin.login': 'title' | 'subtitle' }
 *
 * This means codeFor('admin.login', 'title') is valid,
 * but codeFor('admin', 'login') is not — because 'login' is a branch, not a leaf.
 */
type BranchPaths<T extends Category, Prefix extends string = ''> = {
	[K in keyof T]: T[K] extends Category
		?
				| (keyof { [CK in keyof T[K] as T[K][CK] extends string ? CK : never]: never } extends never
						? never
						: {
								prefix: `${Prefix}${string & K}`;
								suffix: keyof { [CK in keyof T[K] as T[K][CK] extends string ? CK : never]: never } &
									string;
							})
				| BranchPaths<T[K] & Category, `${Prefix}${string & K}.`>
		: never;
}[keyof T];

/**
 * Converts the union of { prefix, suffix } pairs into a mapped type
 * that codeFor() can index into.
 *
 * Result: { 'admin.login': 'title' | 'subtitle', 'admin.register': 'title' | 'subtitle', ... }
 */
type UnionToMap<U extends { prefix: string; suffix: string }> = {
	[P in U['prefix']]: U extends { prefix: P; suffix: infer S } ? S : never;
};

/**
 * All valid prefix -> suffix combinations derived from en.json.
 * Automatically stays in sync — no manual registration needed.
 *
 * A prefix is any branch node path (e.g. 'admin.login').
 * A suffix is any immediate leaf key under that branch (e.g. 'title').
 */
export type TranslationCodePrefixTypes = UnionToMap<BranchPaths<En>>;
