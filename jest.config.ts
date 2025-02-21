import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv:['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^firebase/(.*)$": "<rootDir>/node_modules/firebase/$1",
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest",
  },
 

};

export default createJestConfig(config);