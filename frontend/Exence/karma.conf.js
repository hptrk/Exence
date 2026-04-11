module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-junit-reporter'),
		],
		reporters: ['progress', 'junit'],
		junitReporter: {
			outputDir: 'test-results',
			outputFile: 'results.xml',
			useBrowserName: false,
		},
		browsers: ['ChromeHeadless'],
		singleRun: true,
	});
};
