/* eslint-disable global-require*/

process.env.TEST_ENV = 'wallaby';

module.exports = (wallabyJS) => ({
	files: [
		'src/**/*.+(js|jsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
		'jest.setup.js',
		'!src/**/*.test.js?(x)'
	],

	tests: ['src/**/*.test.js?(x)'],

	filesWithNoCoverageCalculated: [
		'src/entry.js'
	],

	env: {
		type: 'node',
		runner: 'node'
	},

	compilers: {
		'**/*.js?(x)': wallabyJS.compilers.babel(require('./.babelrc.js'))
	},

	testFramework: 'jest',

	delays: {
		run: 500
	}
});
