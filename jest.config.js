// jest.config.js
module.exports = {
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy', // Mock CSS imports
  },
  setupFilesAfterEnv: [
      '@testing-library/jest-dom/extend-expect', // Correct path for extending expect
  ],
};
