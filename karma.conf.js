// Karma configuration
// Generated on Fri Jan 29 2016 11:05:14 GMT+0200 (GTB Standard Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],



        // list of files / patterns to load in the browser
        files: [
            "bower_components/angular/angular.js",
            'bower_components/angular-mocks/angular-mocks.js',
            "bower_components/ngStorage/ngstorage.min.js",
            "bower_components/stacktrace-js/dist/stacktrace.js",
            "bower_components/log4javascript/js/log4javascript.js",
            "bower_components/underscore/underscore-min.js",
            "bower_components/jscache/cache.js",
            "bower_components/moment/min/moment-with-locales.min.js",
            "dist/eswebapi.js",
            "test/spec/*Spec.js",
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
