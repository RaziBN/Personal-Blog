import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./", // Adjust the directory as needed
});

const customJestConfig: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node", // Use "node" for server-side tests
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

export default createJestConfig(customJestConfig);
