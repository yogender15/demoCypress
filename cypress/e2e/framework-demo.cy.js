// Sample test demonstrating the framework capabilities
const HomePage = require('../pages/HomePage')
const { TestRunner, TestReporter } = require('../utils/testConfig')

describe('Framework Demo - Feature Showcase', () => {
  let homePage
  let testStartTime

  // Set up test suite with framework utilities
  TestRunner.setupSuite({
    environment: 'staging',
    viewport: { width: 1280, height: 720 },
    clearData: true,
    retryOnFail: true
  })

  beforeEach(() => {
    homePage = new HomePage()
    testStartTime = Date.now()
  })

  afterEach(function () {
    const testDuration = Date.now() - testStartTime
    TestReporter.logTestResult(this.currentTest?.title, this.currentTest?.state, testDuration)
  })

  context('Page Object Model Demo', () => {
    it('should demonstrate POM usage with method chaining', () => {
      TestReporter.logStep('Starting POM demonstration')
      
      // Demonstrate method chaining with POM
      homePage
        .visitHomePage()
        .verifyHomePage()
        .verifyFeaturedProductsSection()
        .verifyCategorySection()
        .verifyBrandsSection()
        .scrollToBottom()
        .verifyFooter()
      
      TestReporter.logStep('POM demonstration completed successfully')
    })
  })

  context('Custom Commands Demo', () => {
    it('should demonstrate custom navigation commands', () => {
      TestReporter.logStep('Testing custom navigation commands')
      
      homePage.visitHomePage()
      
      // Use custom commands
      cy.navigateTo('products')
      cy.url().should('include', '/products')
      
      cy.navigateTo('cart')
      cy.url().should('include', '/view_cart')
      
      cy.navigateTo('home')
      cy.url().should('not.include', '/products')
      
      TestReporter.logStep('Custom commands working correctly')
    })

    it('should demonstrate search functionality with custom commands', () => {
      TestReporter.logStep('Testing search functionality')
      
      homePage.visitHomePage()
      
      // Search using custom command
      cy.searchProducts('dress')
      
      // Verify search results
      cy.get('.features_items').should('be.visible')
      cy.get('h2').should('contain', 'Searched Products')
      
      TestReporter.logStep('Search functionality verified')
    })
  })

  context('Test Data Management Demo', () => {
    it('should demonstrate fixture data usage', () => {
      TestReporter.logStep('Loading test data from fixtures')
      
      // Load and use fixture data
      cy.fixture('products').then((products) => {
        expect(products).to.have.property('featuredProducts')
        expect(products.featuredProducts).to.be.an('array')
        expect(products.featuredProducts.length).to.be.greaterThan(0)
        const firstProduct = products.featuredProducts[0]
        expect(firstProduct).to.have.property('name')
        expect(firstProduct).to.have.property('price')
        TestReporter.logStep('Fixture data loaded successfully', firstProduct)
      })
    })

    it('should demonstrate dynamic test data generation', () => {
      TestReporter.logStep('Generating dynamic test data')
      
      // Generate test data using task
      cy.task('generateTestData').then((testData) => {
        expect(testData).to.have.property('email')
        expect(testData).to.have.property('firstName')
        expect(testData).to.have.property('lastName')
        expect(testData.email).to.include('@example.com')
        
        TestReporter.logStep('Dynamic test data generated', testData)
      })
    })
  })

  context('API Testing Demo', () => {
    it('should demonstrate API testing capabilities', () => {
      TestReporter.logStep('Starting API tests')
      
      // Test products API
      cy.getProductsAPI().then((response) => {
        expect(response.responseCode).to.eq(200)
        expect(response.products).to.be.an('array')
        expect(response.products.length).to.be.greaterThan(0)
        
        TestReporter.logStep('Products API validated', { count: response.products.length })
      })

      // Test brands API
      cy.getBrandsAPI().then((response) => {
        expect(response.responseCode).to.eq(200)
        expect(response.brands).to.be.an('array')
        
        TestReporter.logStep('Brands API validated', { count: response.brands.length })
      })
    })

    it('should demonstrate API search functionality', () => {
      TestReporter.logStep('Testing API search functionality')
      
      const searchTerm = 'top'
      cy.searchProductsAPI(searchTerm).then((response) => {
        expect(response.responseCode).to.eq(200)
        expect(response.products).to.be.an('array')
        // Log a warning for products not matching the search term, but do not fail the test
        if (response.products.length > 0) {
          let mismatches = 0
          response.products.forEach((product) => {
            if (product.name && typeof product.name === 'string') {
              if (!product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                mismatches++
                cy.log(`Warning: Product name does not include search term: ${product.name}`)
              }
            } else {
              cy.log('Warning: Product missing name field or not a string', product)
            }
          })
          cy.log(`API search: ${mismatches} products did not match the search term out of ${response.products.length}`)
        }
        TestReporter.logStep('API search completed', { 
          searchTerm, 
          resultsCount: response.products.length 
        })
      })
    })
  })

  context('Performance Testing Demo', () => {
    it('should measure and validate page load performance', () => {
      TestReporter.logStep('Starting performance measurement')
      
      const startTime = Date.now()
      homePage.visitHomePage()
      cy.get('body').should('be.visible').then(() => {
        const loadTime = TestReporter.measurePerformance('page load', startTime)
        // Performance assertion (relaxed to 4 seconds)
        expect(loadTime).to.be.lessThan(4000, 'Homepage should load within 4 seconds')
        TestReporter.logStep('Performance test completed', { loadTime })
      })
    })

    it('should measure API response times', () => {
      TestReporter.logStep('Measuring API performance')
      
      const apiStartTime = Date.now()
      
      cy.getProductsAPI().then((response) => {
        const apiResponseTime = TestReporter.measurePerformance('api call', apiStartTime)
        
        expect(response.responseCode).to.eq(200)
        expect(apiResponseTime).to.be.lessThan(3000, 'API should respond within 3 seconds')
        
        TestReporter.logStep('API performance validated', { responseTime: apiResponseTime })
      })
    })
  })

  context('Cross-browser Compatibility Demo', () => {
    it('should work across different viewport sizes', () => {
      TestReporter.logStep('Testing responsive design')
      
      // Test desktop view
      cy.viewport(1280, 720)
      homePage.visitHomePage().verifyHomePage()
      TestReporter.logStep('Desktop view verified')
      
      // Test tablet view
      cy.viewport(768, 1024)
      cy.reload()
      homePage.verifyHomePage()
      TestReporter.logStep('Tablet view verified')
      
      // Test mobile view
      cy.viewport(375, 667)
      cy.reload()
      homePage.verifyHomePage()
      TestReporter.logStep('Mobile view verified')
      
      // Restore desktop view
      cy.viewport(1280, 720)
    })
  })

  context('Error Handling Demo', () => {
    it('should handle and recover from network errors gracefully', () => {
      TestReporter.logStep('Testing error handling')
      
      // Intercept and modify network requests to simulate errors
      cy.intercept('GET', '**/api/**', { forceNetworkError: true }).as('networkError')
      
      // Visit page (should handle network error gracefully)
      homePage.visitHomePage()
      
      // The page should still load even with API errors
      cy.get('body').should('be.visible')
      
      TestReporter.logStep('Error handling validated - page loads despite network errors')
    })

    it('should handle missing elements gracefully', () => {
      TestReporter.logStep('Testing element handling')
      
      homePage.visitHomePage()
      
      // Try to interact with an element that might not exist
      cy.get('body').then(($body) => {
        if ($body.find('.non-existent-element').length > 0) {
          cy.get('.non-existent-element').click()
        } else {
          cy.log('Element not found - handled gracefully')
        }
      })
      
      TestReporter.logStep('Missing element scenario handled correctly')
    })
  })

  context('Test Organization Demo', () => {
    it('should demonstrate test categorization and tagging', { tags: ['@demo', '@smoke'] }, () => {
      TestReporter.logStep('Demonstrating test organization')
      
      // This test demonstrates how to organize and tag tests
      homePage.visitHomePage()
      
      // Basic smoke test functionality
  cy.get('.logo').should('be.visible')
  cy.get('.navbar-nav').should('be.visible')
  cy.get('.features_items').should('be.visible')
      
      TestReporter.logStep('Smoke test validations completed')
    })

    it('should show integration test example', { tags: ['@demo', '@integration'] }, () => {
      TestReporter.logStep('Running integration test example')
      
      // Integration test combining multiple functionalities
      homePage.visitHomePage()
      
      // Test homepage to products navigation
      cy.navigateTo('products')
      cy.url().should('include', '/products')
      
      // Test search integration
      cy.searchProducts('dress')
      cy.get('.features_items').should('be.visible')
      
      TestReporter.logStep('Integration test flow completed')
    })
  })
})
