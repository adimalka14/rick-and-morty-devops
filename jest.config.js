/** @type {import('jest').Config} */
const config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
    reporters: ['default', 'jest-html-reporters'],
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    testRegex: ['(/__tests__/.*(\\.|/)(test|spec))\\.tsx?$'],
    transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }] },
    verbose: true,
};

module.exports = config;
