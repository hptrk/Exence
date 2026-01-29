import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				allowDefaultProject: ['eslint.config.mjs'],
			},
		},
	},
	{
		ignores: ['eslint.config.mjs'],
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			"no-duplicate-imports": "error",
			"no-self-compare": "error",
			"no-unassigned-vars": "warn",

			"@typescript-eslint/consistent-indexed-object-style": "warn",
			"default-param-last": "off",
  			"@typescript-eslint/default-param-last": "error",
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{
					"allowExpressions": true,
					"allowTypedFunctionExpressions": true,
					"allowHigherOrderFunctions": true,
				}
			],
			"@typescript-eslint/member-ordering": [
                "warn",
                {
                    "default": {
                        "memberTypes": [
                            "field",

                            ["get", "set"],
							
                            "constructor",
							
                            "public-instance-method",
                            "public-decorated-method",

                            "private-decorated-method",
                            "private-instance-method"
                        ],
                    }
                }
            ],
			"@typescript-eslint/method-signature-style": ["error", "property"],
			"@typescript-eslint/require-await": "off",
    		"@typescript-eslint/no-deprecated": "warn",
			"@typescript-eslint/no-inferrable-types": "warn",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					"checksVoidReturn": false
				}
			],
			"@typescript-eslint/no-shadow": [
				"error",
				{
					"hoist": "all"
				}
			],
			"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
			"@typescript-eslint/no-unnecessary-condition": "warn",
			"@typescript-eslint/no-unnecessary-qualifier": "error",
			"@typescript-eslint/no-unnecessary-template-expression": "warn",
			"@typescript-eslint/no-unnecessary-type-assertion": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/unbound-method": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-arguments": "off",
			"no-unused-vars": "off",
    		"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					"argsIgnorePattern": "^_",
					"varsIgnorePattern": "^_",
					"caughtErrorsIgnorePattern": "^_",
				}
			],
			"no-use-before-define": "off",
    		"@typescript-eslint/no-use-before-define": "error",
			"@typescript-eslint/consistent-generic-constructors": "off",

			"@stylistic/brace-style": [
				"error",
				"1tbs",
				{
					"allowSingleLine": true
				}
			],
			"@stylistic/comma-dangle": ["error", "only-multiline"],
			"@stylistic/comma-spacing": [
				"error",
				{
					"before": false,
					"after": true
				}
			],
			"@stylistic/indent": ["error", "tab"],
  			"@stylistic/indent-binary-ops": ["error", "tab"],
			"@stylistic/keyword-spacing": [
				"error",
				{
					"before": true,
					"after": true,

				}
			],
			"@stylistic/member-delimiter-style": "error",
			"@stylistic/no-extra-semi": "error",
			"@stylistic/no-floating-decimal": "error",
			"@stylistic/no-mixed-spaces-and-tabs": "error",
			"@stylistic/no-multi-spaces": "error",
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/quotes": ["error", "single"],
			"@stylistic/semi": ["error", "always"],
			"@stylistic/semi-spacing": "error",
			"@stylistic/space-before-blocks": "error",
			"@stylistic/space-before-function-paren": [
				"error",
				{
					"anonymous": "always",
					"named": "never",
					"asyncArrow": "always",
					"catch": "always",
				}
			],
			"@stylistic/space-infix-ops": "error",
			"@stylistic/space-unary-ops": "error",
			"@stylistic/spaced-comment": ["error", "always"],
			"@stylistic/switch-colon-spacing": "error",
			"@stylistic/template-curly-spacing": "error",
			"@stylistic/type-annotation-spacing": "error",
			"@stylistic/type-generic-spacing": ["error"],
			"@stylistic/type-named-tuple-spacing": ["error"],
		},
	},
]);