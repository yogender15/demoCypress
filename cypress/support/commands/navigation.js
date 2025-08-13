// Navigation related custom commands

/**
 * Navigate to specific sections of the website
 * @param {string} section - Section to navigate to
 */
Cypress.Commands.add('navigateTo', (section) => {
  cy.log(`Navigating to: ${section}`)
  
  switch (section.toLowerCase()) {
    case 'home':
      cy.get('a[href="/"]').first().click()
      break
      
    case 'products':
      cy.get('a[href="/products"]').click()
      cy.url().should('include', '/products')
      break
      
    case 'cart':
      cy.get('a[href="/view_cart"]:visible').first().click()
      cy.url().should('include', '/view_cart')
      break
      
      
    case 'contact':
      cy.get('a[href="/contact_us"]').click()
      cy.url().should('include', '/contact_us')
      break
      
    case 'test cases':
      cy.get('a[href="/test_cases"]').click()
      cy.url().should('include', '/test_cases')
      break
      
    default:
      throw new Error(`Unknown section: ${section}`)
  }
})

/**
 * Search for products
 * @param {string} searchTerm - Term to search for
 */
Cypress.Commands.add('searchProducts', (searchTerm) => {
  cy.log(`Searching for: ${searchTerm}`)
  
  // Navigate to products page first
  cy.navigateTo('products')
  
  // Perform search
  cy.get('#search_product').type(searchTerm)
  cy.get('#submit_search').click()
  
  // Verify search results page
  cy.get('.features_items').should('be.visible')
  cy.get('h2').should('contain', 'Searched Products')
})

/**
 * Filter products by category
 * @param {string} category - Category to filter by
 * @param {string} subcategory - Subcategory to filter by (optional)
 */
Cypress.Commands.add('filterByCategory', (category, subcategory = null) => {
  cy.log(`Filtering by category: ${category}${subcategory ? ` > ${subcategory}` : ''}`)
  
  cy.navigateTo('products')
  
  // Click on main category
  cy.get('.panel-group').contains(category).click()
  
  // Click on subcategory if provided
  if (subcategory) {
    cy.get('.panel-body').contains(subcategory).click()
  }
  
  // Verify category filtering
  cy.get('.features_items').should('be.visible')
})

/**
 * Filter products by brand
 * @param {string} brand - Brand to filter by
 */
Cypress.Commands.add('filterByBrand', (brand) => {
  cy.log(`Filtering by brand: ${brand}`)
  
  cy.navigateTo('products')
  
  // Click on brand filter
  cy.get('.brands_products').contains(brand).click()
  
  // Verify brand filtering
  cy.get('.features_items').should('be.visible')
})

/**
 * Navigate to product details
 * @param {number} productId - Product ID
 */
Cypress.Commands.add('viewProductDetails', (productId) => {
  cy.log(`Viewing product details for ID: ${productId}`)
  
  cy.visit(`/product_details/${productId}`)
  cy.get('.product-information').should('be.visible')
})

/**
 * Navigate through pagination
 * @param {number} pageNumber - Page number to navigate to
 */
Cypress.Commands.add('goToPage', (pageNumber) => {
  cy.log(`Navigating to page: ${pageNumber}`)
  
  cy.get('.pagination').contains(pageNumber.toString()).click()
  cy.wait(2000) // Wait for page to load
})

/**
 * Scroll to element smoothly
 * @param {string} selector - CSS selector of element to scroll to
 */
Cypress.Commands.add('scrollToElement', (selector) => {
  cy.log(`Scrolling to element: ${selector}`)
  
  cy.get(selector).scrollIntoView({ duration: 1000, easing: 'swing' })
})

/**
 * Navigate using breadcrumbs
 * @param {string} breadcrumbText - Text of the breadcrumb to click
 */
Cypress.Commands.add('clickBreadcrumb', (breadcrumbText) => {
  cy.log(`Clicking breadcrumb: ${breadcrumbText}`)
  
  cy.get('.breadcrumb').contains(breadcrumbText).click()
})

/**
 * Handle modal dialogs
 * @param {string} action - Action to perform ('close', 'confirm', 'cancel')
 */
Cypress.Commands.add('handleModal', (action = 'close') => {
  cy.log(`Handling modal with action: ${action}`)
  
  cy.get('.modal').should('be.visible')
  
  switch (action.toLowerCase()) {
    case 'close':
      cy.get('.modal .close, .modal-header .close').click()
      break
      
    case 'confirm':
    case 'ok':
      cy.get('.modal-footer .btn-primary, .modal-footer .btn-success').click()
      break
      
    case 'cancel':
      cy.get('.modal-footer .btn-secondary, .modal-footer .btn-default').click()
      break
      
    default:
      cy.get('.modal .close').click()
  }
  
  // Wait for modal to close
  cy.get('.modal').should('not.be.visible')
})

/**
 * Check if element is in viewport
 * @param {string} selector - CSS selector of element
 */
Cypress.Commands.add('isInViewport', (selector) => {
  cy.get(selector).then(($element) => {
    const rect = $element[0].getBoundingClientRect()
    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= Cypress.config().viewportHeight &&
      rect.right <= Cypress.config().viewportWidth
    )
    
    expect(isInViewport).to.be.true
  })
})
