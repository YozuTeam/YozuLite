import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
    ],
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.stories.{js,jsx,ts,tsx}",
        "!src/**/__tests__/**",
        "!src/app/design-system/**",
        "!src/app/layout.tsx",  
        "!src/app/_providers/*",
        "!src/app/_components/*",
        "!src/app/_hooks/**",
        "!src/app/_utils/**",
        "!src/app/_services/**",
        "!src/app/_store/**",
        "!src/app/_types/**",
        "!src/app/_constants/**",
        "!src/app/_styles/**",
        "!src/app/page.tsx",
        "!src/app/test/page.tsx",
    ],
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

