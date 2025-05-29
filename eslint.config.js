import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginQuery from "@tanstack/eslint-plugin-query";

import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			jsxA11y.flatConfigs.recommended,
			// importPlugin.flatConfigs.recommended,
		],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			prettier: prettierPlugin,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"@tanstack/query": pluginQuery,
		},
		rules: {
			...prettier.rules,
			"prettier/prettier": "error",
			...reactHooks.configs.recommended.rules,
			"@tanstack/query/exhaustive-deps": "error",
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
		},
	},
);
