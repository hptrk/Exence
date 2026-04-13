import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	{
		ignores: ['dist', 'node_modules', '.angular', 'eslint.config.mjs', 'src/index.html'],
	},

	eslint.configs.recommended,
	...angular.configs.tsRecommended,

	{
		files: ['**/*.ts'],
		...tseslint.configs.recommendedTypeChecked[0],
		...tseslint.configs.stylisticTypeChecked[0],
		processor: angular.processInlineTemplates,
		languageOptions: {
			parserOptions: {
				projectService: true,
				allowDefaultProject: ['eslint.config.mjs'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'prettier/prettier': 'error',

			'@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'ex', style: 'kebab-case' }],
			'@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: '', style: 'camelCase' }],
			'@angular-eslint/component-class-suffix': ['error', { suffixes: ['Component'] }],
			'@angular-eslint/directive-class-suffix': ['error', { suffixes: ['Directive'] }],
			'@angular-eslint/prefer-output-emitter-ref': 'warn',
			'@angular-eslint/prefer-output-readonly': 'error',
			'@angular-eslint/prefer-signals': 'off',
			'@angular-eslint/no-uncalled-signals': 'warn',
			'@angular-eslint/prefer-signal-model': 'warn',
			'@angular-eslint/prefer-inject': 'warn',
			'@angular-eslint/prefer-host-metadata-property': 'warn',
			'@angular-eslint/no-async-lifecycle-method': 'warn',
			'@angular-eslint/consistent-component-styles': ['error', 'string'],
			'@angular-eslint/contextual-decorator': 'error',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'error',
			'@angular-eslint/no-lifecycle-call': 'error',
			'@angular-eslint/relative-url-prefix': 'warn',
			'@angular-eslint/sort-keys-in-type-decorator': [
				'error',
				{
					Component: ['selector', 'templateUrl', 'template', 'styleUrl', 'imports', 'providers', 'host'],
					Directive: ['selector', 'providers', 'host'],
					Pipe: ['name', 'pure'],
				},
			],
			'@angular-eslint/sort-lifecycle-methods': 'error',
			'@angular-eslint/use-component-selector': 'error',

			'no-duplicate-imports': 'error',
			'no-self-compare': 'error',
			'no-unassigned-vars': 'warn',
			complexity: ['warn', 20], // might need adjustments

			// conflicts with ts version of these configs
			'default-param-last': 'off',
			'no-use-before-define': 'off',
			'no-unused-vars': 'off',
			'no-undef': 'off',

			'@typescript-eslint/no-unnecessary-type-arguments': 'off',
			'@typescript-eslint/consistent-indexed-object-style': 'warn',
			'@typescript-eslint/default-param-last': 'error',
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
					allowHigherOrderFunctions: true,
				},
			],
			'@typescript-eslint/member-ordering': [
				'warn',
				{
					default: {
						memberTypes: [
							'field',
							['get', 'set'],
							'constructor',
							'public-instance-method',
							'public-decorated-method',
							'private-decorated-method',
							'private-instance-method',
						],
					},
				},
			],
			'@typescript-eslint/method-signature-style': ['error', 'property'],
			'@typescript-eslint/no-deprecated': 'warn',
			'@typescript-eslint/no-inferrable-types': 'warn',
			'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
			'@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
			'@typescript-eslint/no-unnecessary-condition': 'warn',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'@typescript-eslint/no-unnecessary-template-expression': 'warn',
			'@typescript-eslint/no-use-before-define': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},

	{
		files: ['**/*.spec.ts'],
		rules: {
			'@angular-eslint/use-component-selector': 'off',
			'@angular-eslint/component-class-suffix': 'off',
		},
	},

	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@angular-eslint/template/no-negated-async': 'warn',
			'@angular-eslint/template/use-track-by-function': 'warn',
			'@angular-eslint/template/prefer-control-flow': 'warn',
			'@angular-eslint/template/prefer-self-closing-tags': 'error',
			'@angular-eslint/template/click-events-have-key-events': 'off',
			'@angular-eslint/template/interactive-supports-focus': 'off',
			'@angular-eslint/template/alt-text': 'off',
		},
	},

	eslintPluginPrettierRecommended,
	eslintConfigPrettier,
]);
