// jest.config.js
module.exports = {
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy', // Mock CSS imports
  },
  testPathIgnorePatterns: [
    "<rootDir>/puppeteer.test.js"
  ],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testEnvironment: 'jest-environment-jsdom', // Specify the environment explicitly
};
