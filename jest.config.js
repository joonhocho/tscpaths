module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
      skipBabel: true,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
