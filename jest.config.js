// jest.config.js
module.exports = {
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy', // Mock CSS imports
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testEnvironment: 'jest-environment-jsdom', // Specify the environment explicitly
};
