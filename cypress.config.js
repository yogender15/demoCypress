const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: "4srh9v",
  e2e: {
    // Base URL for the application under test
    baseUrl: 'https://automationexercise.com',
    
    // Global test settings
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,
    
    // Test file patterns
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Folder configurations
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Browser launch settings
    chromeWebSecurity: false,
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    // Reporter configuration for Mochawesome
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'E-Commerce Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
    
    // Environment variables
    env: {
      // Test environment configurations
      staging: {
        baseUrl: 'https://automationexercise.com',
        apiUrl: 'https://automationexercise.com/api'
      },
      production: {
        baseUrl: 'https://automationexercise.com',
        apiUrl: 'https://automationexercise.com/api'
      },
      
      
      // API endpoints
      apiEndpoints: {
  products: '/productsList',
  brands: '/brandsList',
  searchProduct: '/searchProduct'
      }
    },
    
    setupNodeEvents(on, config) {
      // Import mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);
      
      // Set up environment-specific configuration
      const environment = config.env.environment || 'staging';
      if (config.env[environment]) {
        config.baseUrl = config.env[environment].baseUrl;
        config.env.apiUrl = config.env[environment].apiUrl;
      }
      
      // Custom task for handling test data
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Generate random test data
        generateTestData() {
          const timestamp = Date.now();
          return {
            email: `testuser_${timestamp}@example.com`,
            firstName: `TestUser${timestamp}`,
            lastName: 'TestSuite',
            password: 'TestPassword123!',
            company: 'Test Company',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipcode: '12345',
            mobile: '1234567890'
          };
        }
      });
      
      return config;
    },
  },
})
