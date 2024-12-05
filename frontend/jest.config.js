module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs|cjs)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-leaflet$': '<rootDir>/src/__mocks__/react-leaflet.js',
    '^leaflet$': '<rootDir>/src/__mocks__/leaflet.js',
    '^leaflet.heat$': '<rootDir>/src/__mocks__/leaflet.heat.js',
    '^axios$': '<rootDir>/src/__mocks__/axios.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios|leaflet|react-leaflet|@babel/runtime)/',
  ],
  testEnvironment: 'happy-dom',
