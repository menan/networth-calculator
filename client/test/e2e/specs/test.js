// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.networth-calculator')
      .assert.containsText('h2', 'Networth Calculator')
      .assert.elementCount('h3', 2)
      .assert.elementCount('h4', 4)
      .assert.elementCount('button', 4)
      .assert.containsText('button', 'Add Field')
      .assert.elementCount('.fields', 29)
      .end()
  }
}
