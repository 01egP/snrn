module.exports = {
    jest: (config) => {
      config.preset = 'ts-jest';
      config.testEnvironment = 'jsdom';
      return config;
    },
  };
  