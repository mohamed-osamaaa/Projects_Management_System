module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '.*\\.e2e-spec\\.ts$',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^database/(.*)$': '<rootDir>/database/$1',
    },
};