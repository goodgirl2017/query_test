exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    'test.js'
  ],

  capabilities: {
    browserName: 'chrome'
  },

  baseUrl: 'http://localhost:8000',

  allScriptsTimeout: 30000

};