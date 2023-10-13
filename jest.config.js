module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/tests/**/*.(test|spec).ts'],
  setupFiles: ['<rootDir>/tests/envs/setup-envs.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/envs/jest.setup.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/tests/$1',
    axios: 'axios/dist/node/axios.cjs',
  },
  restoreMocks: true,
};
