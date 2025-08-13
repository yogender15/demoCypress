// Import commands.js using ES2015 syntax
import './commands/cart'
import './commands/navigation'
import './commands/api'

// Import cypress-mochawesome-reporter support
import 'cypress-mochawesome-reporter/register'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// You can also import supporting libraries
import 'cypress-grep'

// Global before hook for test setup
beforeEach(() => {
  // Set up viewport for mobile/desktop testing
  if (Cypress.env('mobile')) {
    cy.viewport(375, 667) // iPhone 6/7/8 dimensions
  } else {
    cy.viewport(1280, 720) // Desktop dimensions
  }
})

// Global configuration and error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // This is useful for third-party scripts that may throw errors
  if (err.message.includes('Script error')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  // Allow other exceptions to fail the test
  return true
})

// Add custom assertion messages
chai.use((chai, utils) => {
  chai.Assertion.addMethod('containText', function(expectedText) {
    const actualText = this._obj.text()
    this.assert(
      actualText.includes(expectedText),
      `expected element to contain text "${expectedText}" but got "${actualText}"`,
      `expected element to not contain text "${expectedText}" but it did contain "${actualText}"`,
      expectedText,
      actualText
    )
  })
})
