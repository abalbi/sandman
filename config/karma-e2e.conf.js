module.exports = function(config){
  config.set({
    basePath : '../',
    files : [
      'node_modules/requirejs/*.js',
      'test/e2e/**/*.js'
    ],
    autoWatch : false,
    browsers : ['Chrome'],
    frameworks: ['ng-scenario'],
    singleRun : false,
    proxies : {
      '/': 'http://localhost:3001/'
    },
    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-ng-scenario'
    ],
    junitReporter : {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    }
  }
)}

