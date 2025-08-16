/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/pkg'],
  testMatch: [
    '**/src/pkg/**/__tests__/**/*.ts',
    '**/src/pkg/**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/pkg/**/*.ts',
    '!src/pkg/**/*.test.ts',
    '!src/pkg/**/*.spec.ts',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [],
  verbose: true,
  testTimeout: 10000,
};