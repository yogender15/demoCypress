// Test utilities and helper functions

class TestUtils {
  /**
   * Wait for element to be visible with custom timeout
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in milliseconds
   */
  static waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible')
  }

  /**
   * Wait for page to load completely
   */
  static waitForPageLoad() {
    cy.window().should('have.property', 'document')
    cy.document().should('have.property', 'readyState', 'complete')
  }

  /**
   * Take screenshot with timestamp
   * @param {string} name - Screenshot name
   */
  static takeTimestampedScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    cy.screenshot(`${name}_${timestamp}`)
  }

  /**
   * Log test step
   * @param {string} step - Step description
   */
  static logStep(step) {
    cy.log(`STEP: ${step}`)
  }

  /**
   * Verify element text with retry
   * @param {string} selector - CSS selector
   * @param {string} expectedText - Expected text
   * @param {number} maxRetries - Maximum retries
   */
  static verifyTextWithRetry(selector, expectedText, maxRetries = 3) {
    let retries = 0
    
    const verifyText = () => {
      cy.get(selector).then(($el) => {
        const actualText = $el.text().trim()
        if (actualText !== expectedText && retries < maxRetries) {
          retries++
          cy.wait(1000)
          verifyText()
        } else {
          expect(actualText).to.equal(expectedText)
        }
      })
    }
    
    verifyText()
  }

  /**
   * Handle browser alerts
   * @param {string} action - 'accept' or 'dismiss'
   */
  static handleAlert(action = 'accept') {
    cy.window().then((win) => {
      cy.stub(win, 'alert').returns(true)
      if (action === 'accept') {
        cy.stub(win, 'confirm').returns(true)
      } else {
        cy.stub(win, 'confirm').returns(false)
      }
    })
  }

  /**
   * Upload file
   * @param {string} selector - File input selector
   * @param {string} fileName - File name in fixtures folder
   * @param {string} mimeType - File MIME type
   */
  static uploadFile(selector, fileName, mimeType = 'image/jpeg') {
    cy.get(selector).selectFile({
      contents: `cypress/fixtures/${fileName}`,
      mimeType: mimeType
    })
  }

  /**
   * Generate random test data on the fly
   * @param {string} type - Type of data to generate
   * @returns {any} Generated data
   */
  static generateTestData(type) {
    const timestamp = Date.now()
    
    switch (type.toLowerCase()) {
      case 'email':
        return `testuser_${timestamp}@example.com`
      case 'name':
        return `TestUser_${timestamp}`
      case 'phone':
        return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
      case 'password':
        return `TestPass${timestamp}!`
      default:
        return `TestData_${timestamp}`
    }
  }

  /**
   * Retry command with exponential backoff
   * @param {Function} command - Cypress command to retry
   * @param {number} maxAttempts - Maximum attempts
   * @param {number} delay - Initial delay in ms
   */
  static retryWithBackoff(command, maxAttempts = 3, delay = 1000) {
    let attempts = 0
    
    const executeCommand = () => {
      return command().catch((error) => {
        attempts++
        if (attempts >= maxAttempts) {
          throw error
        }
        
        const backoffDelay = delay * Math.pow(2, attempts - 1)
        cy.wait(backoffDelay)
        return executeCommand()
      })
    }
    
    return executeCommand()
  }

  /**
   * Check if element exists without failing
   * @param {string} selector - CSS selector
   * @returns {boolean} True if element exists
   */
  static elementExists(selector) {
    return cy.get('body').then($body => {
      return $body.find(selector).length > 0
    })
  }

  /**
   * Scroll to element with smooth behavior
   * @param {string} selector - CSS selector
   */
  static smoothScrollTo(selector) {
    cy.get(selector).scrollIntoView({ 
      duration: 1000,
      easing: 'swing'
    })
  }

  /**
   * Clear browser data
   */
  static clearBrowserData() {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.clearSessionStorage()
  }

  /**
   * Mock API response
   * @param {string} method - HTTP method
   * @param {string} url - URL pattern
   * @param {Object} response - Mock response
   * @param {string} alias - Alias for the intercept
   */
  static mockApiResponse(method, url, response, alias) {
    cy.intercept(method, url, response).as(alias)
  }

  /**
   * Get element text and return as promise
   * @param {string} selector - CSS selector
   * @returns {Promise<string>} Element text
   */
  static getElementText(selector) {
    return cy.get(selector).invoke('text').then(text => text.trim())
  }

  /**
   * Format currency value
   * @param {string} currency - Currency string (e.g., "Rs. 500")
   * @returns {number} Numeric value
   */
  static parseCurrency(currency) {
    return parseFloat(currency.replace(/[^\d.]/g, ''))
  }

  /**
   * Compare arrays ignoring order
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {boolean} True if arrays contain same elements
   */
  static arraysEqualIgnoreOrder(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
    
    const sorted1 = [...arr1].sort()
    const sorted2 = [...arr2].sort()
    
    return sorted1.every((val, index) => val === sorted2[index])
  }

  /**
   * Generate unique test ID
   * @param {string} prefix - ID prefix
   * @returns {string} Unique test ID
   */
  static generateTestId(prefix = 'test') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Convert string to title case
   * @param {string} str - Input string
   * @returns {string} Title case string
   */
  static toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Extract numbers from string
   * @param {string} str - Input string
   * @returns {Array<number>} Array of numbers found in string
   */
  static extractNumbers(str) {
    const matches = str.match(/\d+(\.\d+)?/g)
    return matches ? matches.map(Number) : []
  }

  /**
   * Create delay/wait utility
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after delay
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get current timestamp in different formats
   * @param {string} format - Format type ('iso', 'unix', 'readable')
   * @returns {string|number} Formatted timestamp
   */
  static getCurrentTimestamp(format = 'iso') {
    const now = new Date()
    
    switch (format.toLowerCase()) {
      case 'iso':
        return now.toISOString()
      case 'unix':
        return Math.floor(now.getTime() / 1000)
      case 'readable':
        return now.toLocaleString()
      default:
        return now.toISOString()
    }
  }
}

module.exports = TestUtils
