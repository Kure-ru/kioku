export default {
    rootDir: './src/',
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: 'tsconfig.app.json',
        }],
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/__ mocks __/fileMock.js',
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/__ mocks __/matchMedia.ts'],
}