// Cart related custom commands

/**
 * Add product to cart by product ID
 * @param {number} productId - Product ID to add to cart
 * @param {number} quantity - Quantity to add (default: 1)
 */
Cypress.Commands.add('addToCart', (productId, quantity = 1) => {
  cy.log(`Adding product ${productId} to cart with quantity ${quantity}`)
  
  // Navigate to product page
  cy.visit(`/product_details/${productId}`)
  
  // Update quantity if needed
  if (quantity > 1) {
    cy.get('#quantity').clear().type(quantity.toString())
  }
  
  // Add to cart
  cy.get('.btn.btn-default.cart').click()
  
  // Handle the modal that appears after adding to cart
  cy.get('#cartModal').should('be.visible')
  cy.get('.modal-footer .btn.btn-success').click() // Continue Shopping
})

/**
 * Add multiple products to cart
 * @param {Array} products - Array of objects with productId and quantity
 */
Cypress.Commands.add('addMultipleToCart', (products) => {
  cy.log(`Adding ${products.length} products to cart`)
  
  products.forEach((product, index) => {
    cy.addToCart(product.productId, product.quantity)
    
    // Add delay between products to avoid rate limiting
    if (index < products.length - 1) {
      cy.wait(1000)
    }
  })
})

/**
 * View cart
 */
Cypress.Commands.add('viewCart', () => {
  cy.log('Viewing cart')
  
  cy.get('a[href="/view_cart"]').click()
  cy.url().should('include', '/view_cart')
  cy.get('.cart_info').should('be.visible')
})

/**
 * Remove product from cart
 * @param {number} productIndex - Index of product to remove (0-based)
 */
Cypress.Commands.add('removeFromCart', (productIndex = 0) => {
  cy.log(`Removing product at index ${productIndex} from cart`)
  
  cy.get('.cart_quantity_delete').eq(productIndex).click()
  
  // Wait for the product to be removed
  cy.wait(2000)
})

/**
 * Update product quantity in cart
 * @param {number} productIndex - Index of product to update (0-based)
 * @param {number} newQuantity - New quantity
 */
Cypress.Commands.add('updateCartQuantity', (productIndex, newQuantity) => {
  cy.log(`Updating product ${productIndex} quantity to ${newQuantity}`)
  
  cy.get('.cart_quantity_input').eq(productIndex).clear().type(newQuantity.toString())
  cy.get('.cart_quantity_input').eq(productIndex).blur()
  
  // Wait for quantity to update
  cy.wait(2000)
})

/**
 * Get cart total
 */
Cypress.Commands.add('getCartTotal', () => {
  return cy.get('.cart_total_price').invoke('text').then((text) => {
    // Extract numeric value from price text (e.g., "Rs. 500" -> 500)
    const price = text.replace(/[^\d.]/g, '')
    return parseFloat(price)
  })
})

/**
 * Verify cart item
 * @param {Object} expectedItem - Expected item details
 */
Cypress.Commands.add('verifyCartItem', (expectedItem) => {
  const { name, price, quantity, total } = expectedItem
  
  cy.log(`Verifying cart item: ${name}`)
  
  // Find the cart item row
  cy.get('#cart_info_table tbody tr').each(($row) => {
    cy.wrap($row).within(() => {
      cy.get('.cart_description h4 a').invoke('text').then((itemName) => {
        if (itemName.trim() === name) {
          // Verify price
          if (price) {
            cy.get('.cart_price p').should('contain', price)
          }
          
          // Verify quantity
          if (quantity) {
            cy.get('.cart_quantity_input').should('have.value', quantity.toString())
          }
          
          // Verify total
          if (total) {
            cy.get('.cart_total_price').should('contain', total)
          }
        }
      })
    })
  })
})

/**
 * Clear entire cart
 */
Cypress.Commands.add('clearCart', () => {
  cy.log('Clearing entire cart')
  
  cy.viewCart()
  
  // Remove all items from cart
  cy.get('body').then(($body) => {
    if ($body.find('.cart_quantity_delete').length > 0) {
      cy.get('.cart_quantity_delete').each(($deleteBtn) => {
        cy.wrap($deleteBtn).click()
        cy.wait(1000) // Wait for item removal
      })
    }
  })
})

/**
 * Proceed to checkout
 */
Cypress.Commands.add('proceedToCheckout', () => {
  cy.log('Proceeding to checkout')
  
  cy.get('.btn.btn-default.check_out').click()
})
