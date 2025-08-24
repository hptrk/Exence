// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		rules: {
			'@typescript-eslint/dot-notation': 'off',
			'@typescript-eslint/array-type': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'error',
			'@typescript-eslint/no-wrapper-object-types': 'error',

			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: [],
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'ex',
					style: 'kebab-case',
				},
			],
			// TS naming conventions
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'enumMember',
					format: ['UPPER_CASE'],
				},
				{
					selector: ['classProperty'],
					format: ['PascalCase'],
					filter: {
						regex: '.*Enum',
						match: true,
					},
				},
				{
					selector: ['classProperty'],
					format: ['UPPER_CASE'],
					modifiers: ['readonly'],
				},
				{
					selector: ['classProperty'],
					format: ['UPPER_CASE'],
					modifiers: ['static'],
				},
				{
					selector: ['variable', 'classProperty', 'method'],
					format: ['camelCase'],
				},
				{
					selector: ['variable'],
					format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
					modifiers: ['const', 'exported'],
				},
			],
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
					allowHigherOrderFunctions: true,
					allowDirectConstAssertionInArrowFunctions: true,
					allowConciseArrowFunctionExpressionsStartingWithVoid: false,
				},
			],
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{
					assertionStyle: 'as',
					objectLiteralTypeAssertions: 'allow-as-parameter',
				},
			],
			'@typescript-eslint/indent': ['off', 'tab'],
			'@typescript-eslint/member-ordering': [
				'warn',
				{
					default: [],
					classes: [['field', 'get', 'set'], 'constructor', 'instance-method'],
				},
			],
			'@typescript-eslint/prefer-const': [
				'error',
				{
					destructuring: 'any',
					ignoreReadBeforeAssign: false,
				},
			],
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/typedef': 'error',
			'@typescript-eslint/no-for-in-array': 'error',
			'@typescript-eslint/no-this-alias': 'error',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',

			'@stylistic/quotes': [
				'error',
				'single',
				{
					allowTemplateLiterals: true,
				},
			],
			'@stylistic/type-annotation-spacing': 'error',

			// JS base rules
			'brace-style': ['error', '1tbs'],
			'id-blacklist': 'off',
			'id-match': 'off',
			'max-len': [
				'error',
				{
					ignorePattern: '^import [^,]+ from |^export | implements',
					code: 150,
				},
			],
			'no-underscore-dangle': 'off',
			'jsdoc/newline-after-description': 'off',
			'object-curly-spacing': ['warn', 'always'],
			'no-mixed-spaces-and-tabs': 'error',
			'import/order': 'error',
			'import/no-unused-modules': 'warn',
			'@typescript-eslint/require-await': 'error',
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		rules: {},
	},
);
