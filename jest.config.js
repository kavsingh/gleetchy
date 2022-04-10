module.exports = {
  setupFiles: ['<rootDir>/__test-setup__/index.js'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    'src/apis/**/*.ts',
    'src/constants/**/*.ts',
    'src/nodes/**/create-audio-node.ts',
    'src/state/**/*.ts',
    'src/util/**/*.ts',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__testMocks__/file-mock.js',
  },
  testEnvironment: 'jsdom',
}
