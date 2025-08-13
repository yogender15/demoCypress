// Environment configuration and test setup utilities

class EnvironmentConfig {
  /**
   * Get environment-specific configuration
   * @param {string} env - Environment name (staging, production)
   * @returns {Object} Environment configuration
   */
  static getConfig(env = 'staging') {
    const environments = {
      staging: {
        baseUrl: 'https://automationexercise.com',
        apiUrl: 'https://automationexercise.com/api',
        timeout: 10000,
        retries: 2
      },
      production: {
        baseUrl: 'https://automationexercise.com',
        apiUrl: 'https://automationexercise.com/api',
        timeout: 15000,
        retries: 3
      },
      local: {
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3000/api',
        timeout: 5000,
        retries: 1
      }
    }
    
    return environments[env] || environments.staging
  }

  /**
   * Set up test environment
   * @param {string} environment - Environment to set up
   */
  static setupEnvironment(environment = 'staging') {
    const config = this.getConfig(environment)
    
    Cypress.config('baseUrl', config.baseUrl)
    Cypress.config('defaultCommandTimeout', config.timeout)
    Cypress.env('apiUrl', config.apiUrl)
    
    cy.log(`Environment set to: ${environment}`)
    cy.log(`Base URL: ${config.baseUrl}`)
  }

  /**
   * Get test user credentials based on environment
   * @param {string} userType - Type of user (admin, regular, guest)
   * @param {string} environment - Environment name
   * @returns {Object} User credentials
   */
  static getTestUser(userType = 'regular', environment = 'staging') {
    const users = {
      staging: {
        admin: {
          email: 'admin.staging@example.com',
          password: 'AdminStaging123!',
          name: 'Admin User'
        },
        regular: {
          email: 'testuser.staging@example.com',
          password: 'TestStaging123!',
          name: 'Test User'
        }
      },
      production: {
        admin: {
          email: 'admin.prod@example.com',
          password: 'AdminProd123!',
          name: 'Admin User'
        },
        regular: {
          email: 'testuser.prod@example.com',
          password: 'TestProd123!',
          name: 'Test User'
        }
      }
    }
    
    return users[environment]?.[userType] || users.staging.regular
  }
}

class TestRunner {
  /**
   * Set up test suite with common configurations
   * @param {Object} options - Test suite options
   */
  static setupSuite(options = {}) {
    const {
      environment = 'staging',
      viewport = { width: 1280, height: 720 },
      clearData = true,
      retryOnFail = true
    } = options
    
    before(() => {
      EnvironmentConfig.setupEnvironment(environment)
      cy.viewport(viewport.width, viewport.height)
      
      if (clearData) {
        cy.clearCookies()
        cy.clearLocalStorage()
      }
    })
    
    beforeEach(() => {
      if (clearData) {
        cy.clearCookies()
        cy.clearLocalStorage()
      }
      
      // Set up error handling
      cy.on('fail', (error) => {
        cy.screenshot(`failed-test-${Date.now()}`)
        throw error
      })
    })
    
    if (retryOnFail) {
      afterEach(() => {
        // Retry logic can be implemented here
        if (this.currentTest?.state === 'failed' && this.currentTest?.retriedTimes < 2) {
          cy.log(`Retrying failed test: ${this.currentTest.title}`)
        }
      })
    }
  }

  /**
   * Run smoke tests
   * @param {Array} testFiles - Array of test files to run
   */
  static runSmokeTests(testFiles = []) {
    testFiles.forEach(testFile => {
      describe(`Smoke Test: ${testFile}`, () => {
        it('should load and execute basic functionality', () => {
          cy.visit('/')
          cy.get('body').should('be.visible')
          cy.title().should('not.be.empty')
        })
      })
    })
  }
}

class TestReporter {
  /**
   * Log test step with timestamp
   * @param {string} step - Step description
   * @param {Object} data - Additional data to log
   */
  static logStep(step, data = {}) {
    const timestamp = new Date().toISOString()
    cy.log(`[${timestamp}] STEP: ${step}`, data)
    
    // Optional: Send to external logging service
    if (Cypress.env('EXTERNAL_LOGGING')) {
      this.sendToExternalLogger(step, data, timestamp)
    }
  }

  /**
   * Log test result
   * @param {string} testName - Test name
   * @param {string} status - Test status (passed, failed, skipped)
   * @param {number} duration - Test duration in ms
   */
  static logTestResult(testName, status, duration) {
    const result = {
      test: testName,
      status: status,
      duration: duration,
      timestamp: new Date().toISOString()
    }
    
    cy.log(`Test Result: ${JSON.stringify(result)}`)
    
    // Store result for reporting
    if (!window.testResults) {
      window.testResults = []
    }
    window.testResults.push(result)
  }

  /**
   * Generate performance metrics
   * @param {string} operationName - Name of the operation
   * @param {number} startTime - Start time timestamp
   */
  static measurePerformance(operationName, startTime) {
    const endTime = Date.now()
    const duration = endTime - startTime
    
    cy.log(`Performance: ${operationName} took ${duration}ms`)
    
    // Assert performance thresholds
    if (operationName.includes('page load')) {
      expect(duration).to.be.lessThan(3000, `Page load should be under 3 seconds, but took ${duration}ms`)
    } else if (operationName.includes('api call')) {
      expect(duration).to.be.lessThan(2000, `API call should be under 2 seconds, but took ${duration}ms`)
    }
    
    return duration
  }

  /**
   * Send data to external logging service (placeholder)
   * @param {string} step - Step description
   * @param {Object} data - Additional data
   * @param {string} timestamp - Timestamp
   */
  static sendToExternalLogger(step, data, timestamp) {
    // Implementation would depend on external logging service
    // e.g., send to Elasticsearch, Splunk, etc.
    console.log('External logging:', { step, data, timestamp })
  }
}

class TestDataManager {
  /**
   * Create test data snapshot
   * @param {string} testName - Test name
   * @returns {Object} Test data snapshot
   */
  static createSnapshot(testName) {
    const snapshot = {
      testName: testName,
      timestamp: Date.now(),
      environment: Cypress.env('environment') || 'staging',
      browser: Cypress.browser.name,
      viewport: {
        width: Cypress.config('viewportWidth'),
        height: Cypress.config('viewportHeight')
      }
    }
    
    return snapshot
  }

  /**
   * Clean up test data after test execution
   * @param {Object} snapshot - Test data snapshot
   */
  static cleanup(snapshot) {
    cy.log(`Cleaning up test data for: ${snapshot.testName}`)
    
    // Clean up any test-specific data
    // This could include database cleanup, file deletion, etc.
    
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.clearSessionStorage()
  }

  /**
   * Backup current state
   * @param {string} stateName - Name of the state to backup
   */
  static backupState(stateName) {
    cy.getCookies().then(cookies => {
      cy.writeFile(`cypress/temp/${stateName}_cookies.json`, cookies)
    })
    
    cy.window().then(win => {
      const localStorage = { ...win.localStorage }
      const sessionStorage = { ...win.sessionStorage }
      
      cy.writeFile(`cypress/temp/${stateName}_storage.json`, {
        localStorage,
        sessionStorage
      })
    })
  }

  /**
   * Restore previously backed up state
   * @param {string} stateName - Name of the state to restore
   */
  static restoreState(stateName) {
    cy.readFile(`cypress/temp/${stateName}_cookies.json`).then(cookies => {
      cookies.forEach(cookie => {
        cy.setCookie(cookie.name, cookie.value)
      })
    })
    
    cy.readFile(`cypress/temp/${stateName}_storage.json`).then(storage => {
      cy.window().then(win => {
        Object.keys(storage.localStorage).forEach(key => {
          win.localStorage.setItem(key, storage.localStorage[key])
        })
        
        Object.keys(storage.sessionStorage).forEach(key => {
          win.sessionStorage.setItem(key, storage.sessionStorage[key])
        })
      })
    })
  }
}

module.exports = {
  EnvironmentConfig,
  TestRunner,
  TestReporter,
  TestDataManager
}
