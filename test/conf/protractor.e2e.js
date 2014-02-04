// An example configuration file.
exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:9000/',

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['../e2e/*.spec.js'],

    // Override the timeout for webdriver to 20 seconds.
    allScriptsTimeout: 20000,

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};