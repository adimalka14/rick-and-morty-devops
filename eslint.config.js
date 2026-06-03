const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "coverage/**",
            "jest-html-reporters-attach/**",
            "jest.config.js",
            "eslint.config.js",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        files: ["src/**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn"],
            "@typescript-eslint/explicit-module-boundary-types": "off",
        },
    },
];
