module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@react-navigation|@testing-library)',
  ],
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
};
