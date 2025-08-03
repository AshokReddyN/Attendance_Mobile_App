module.exports = {
  preset: 'jest-expo',
  rootDir: '.',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@react-navigation|@testing-library)',
  ],
  setupFilesAfterEnv: ['<rootDir>/node_modules/@testing-library/react-native/extend-expect'],
};
