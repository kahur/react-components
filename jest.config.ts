import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "^@kh-react-components/(.*)": "<rootDir>/src/components/$1",
        "\\.(css|less|scss)$": "identity-obj-proxy", // Mock CSS files
    },
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript files
    },
}

export default config;