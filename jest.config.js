module.exports = {
  setupFiles: ['<rootDir>/__test-setup__/index.js'],
  testRegex: '^.+\\.test\\.[jt]sx?$',
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/node_modules/babel-jest',
  },
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    'src/apis/**/*.ts',
    'src/constants/**/*.ts',
    'src/nodes/**/createAudioNode.ts',
    'src/state/**/*.ts',
    'src/util/**/*.ts',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__testMocks__/file-mock.js',
  },
}
