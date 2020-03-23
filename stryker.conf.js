module.exports = (config) => {
  config.set({
    mutate: ['src/**/*.ts', '!src/**/*@(.test|.spec|Spec).ts'],
    mutator: 'typescript',
    testRunner: 'jest',
    reporters: ['progress', 'clear-text', 'html'],
    coverageAnalysis: 'off',
    jest: {
      projectType: 'custom',
      config: require('./jest.config.js'),
      enableFindRelatedTests: true,
    },
  })
}
