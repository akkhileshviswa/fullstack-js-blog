export default {
    testEnvironment: "node",
    transform: {},
    injectGlobals: true,
    setupFiles: ["<rootDir>/__tests__/setup.js"],

    testMatch: [
        "**/__tests__/**/*.test.js",
        "**/?(*.)+(spec|test).js"
    ],

    collectCoverageFrom: [
        "controllers/**/*.js",
        "routes/**/*.js",
        "middlewares/**/*.js",
        "utils/**/*.js",
        "!**/node_modules/**",
        "!**/__tests__/**"
    ],

    coverageDirectory: "coverage",
    verbose: true,
    testTimeout: 10000
};
