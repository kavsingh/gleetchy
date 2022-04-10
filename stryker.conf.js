module.exports = {
  mutate: [
    'src/**/*.ts?(x)',
    '!src/**/*@(.test|.spec|Spec).ts',
    '!src/**/types.ts',
    '!src/**/constants.ts',
  ],
  plugins: ['@stryker-mutator/jest-runner'],
  testRunner: 'jest',
  reporters: ['progress', 'clear-text', 'html'],
  coverageAnalysis: 'all',
  jest: {
    projectType: 'custom',
    configFile: './jest.config.js',
    enableFindRelatedTests: true,
  },
}
