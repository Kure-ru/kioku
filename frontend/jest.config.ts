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
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/test/__ mocks __/matchMedia.ts'],
}