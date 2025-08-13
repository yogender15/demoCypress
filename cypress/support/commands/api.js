// API testing related custom commands

/**
 * Test API endpoints
 */

/**
 * Get all products via API
 */
Cypress.Commands.add('getProductsAPI', () => {
  cy.log('Getting products via API')
  
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/productsList`,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(200)
    let body = response.body
    if (typeof body === 'string') {
      body = JSON.parse(body)
    }
    expect(body).to.have.property('responseCode')
    return body
  })
})

/**
 * Get all brands via API
 */
Cypress.Commands.add('getBrandsAPI', () => {
  cy.log('Getting brands via API')
  
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/brandsList`,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(200)
    let body = response.body
    if (typeof body === 'string') {
      body = JSON.parse(body)
    }
    expect(body).to.have.property('responseCode')
    return body
  })
})

/**
 * Search products via API
 * @param {string} searchTerm - Search term
 */
Cypress.Commands.add('searchProductsAPI', (searchTerm) => {
  cy.log(`Searching products via API: ${searchTerm}`)
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/searchProduct`,
    form: true,
    body: {
      search_product: searchTerm
    },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(200)
    let body = response.body
    if (typeof body === 'string') {
      body = JSON.parse(body)
    }
    return body
  })
})


/**
 * Generic API request helper
 * @param {Object} requestConfig - Request configuration
 */
Cypress.Commands.add('apiRequest', (requestConfig) => {
  const {
    method = 'GET',
    endpoint,
    body = {},
    headers = {},
    form = false,
    failOnStatusCode = false
  } = requestConfig
  
  cy.log(`API Request: ${method} ${endpoint}`)
  
  const config = {
    method: method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    headers: {
      'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json',
      ...headers
    },
    failOnStatusCode: failOnStatusCode
  }
  
  if (method !== 'GET' && Object.keys(body).length > 0) {
    if (form) {
      config.form = true
      config.body = body
    } else {
      config.body = body
    }
  }
  
  return cy.request(config)
})

/**
 * Validate API response structure
 * @param {Object} response - API response
 * @param {Object} expectedStructure - Expected response structure
 */
Cypress.Commands.add('validateAPIResponse', (response, expectedStructure) => {
  cy.log('Validating API response structure')
  
  // Check status code
  if (expectedStructure.statusCode) {
    expect(response.status).to.eq(expectedStructure.statusCode)
  }
  
  // Check response body properties
  if (expectedStructure.properties) {
    expectedStructure.properties.forEach(property => {
      expect(response.body).to.have.property(property)
    })
  }
  
  // Check response code in body
  if (expectedStructure.responseCode) {
    expect(response.body.responseCode).to.eq(expectedStructure.responseCode)
  }
  
  // Check if response contains data
  if (expectedStructure.hasData) {
    expect(response.body).to.have.property('products')
    expect(response.body.products).to.be.an('array')
  }
})
