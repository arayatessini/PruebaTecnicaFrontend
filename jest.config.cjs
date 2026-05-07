// jest.config.cjs
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  testMatch: [
    '<rootDir>/src/app/features/episodes/services/*.spec.ts',
  ],
};
