// export default {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   testMatch: ["**/__tests__/**/*.test.ts"], // Specify test file pattern
//   moduleFileExtensions: ["ts", "js", "json", "node"],
//   clearMocks: true,
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Optional: for setup files
// };
// import type { Config } from 'jest';

// const config: Config = {
//   verbose: true,
//   preset: "ts-jest",
//   testEnvironment: "node",
//   testMatch: ["**/__tests__/**/*.test.ts"],
//   moduleFileExtensions: ["ts", "js", "json", "node"],
//   clearMocks: true,
// };

// export default config;


import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  clearMocks: true,
  setupFiles: ["<rootDir>/jest.setup.ts"], // Set up environment variables
};

export default config;
