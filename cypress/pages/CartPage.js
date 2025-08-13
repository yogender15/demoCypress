const BasePage = require('./BasePage')

class CartPage extends BasePage {
  constructor() {
    super()
    this.url = '/view_cart'
    
    // Selectors
    this.selectors = {
      // Page elements
      pageTitle: '.breadcrumb li.active',
      cartTable: '#cart_info_table',
      cartTableHeader: '.cart_info thead',
      cartTableBody: '.cart_info tbody',
      cartRows: '#cart_info_table tbody tr',
      
      // Cart item elements
      productImage: '.cart_product img',
      productDescription: '.cart_description h4 a',
      productPrice: '.cart_price p',
      productQuantity: '.cart_quantity_input',
      productTotal: '.cart_total_price',
      deleteButton: '.cart_quantity_delete',
      
      // Cart summary elements
      totalAmount: '.cart_total_price',
      proceedCheckoutBtn: '.btn.btn-default.check_out',
      
      // Empty cart
      emptyCartMessage: '#empty_cart',
      
      // Recommended items
      recommendedItems: '#recommended-item-carousel',
      
      // Breadcrumb
      breadcrumb: '.breadcrumb'
    }
  }

  // Navigation methods
  visitCartPage() {
    this.visit()
    this.verifyCartPage()
    return this
  }

  verifyCartPage() {
    this.verifyElementVisible(this.selectors.cartTable)
    this.getCurrentURL().should('include', '/view_cart')
    return this
  }

  // Cart information methods
  getCartItemsCount() {
    return cy.get(this.selectors.cartRows).its('length')
  }

  verifyCartIsEmpty() {
    cy.get('body').then(($body) => {
      if ($body.find(this.selectors.emptyCartMessage).length > 0) {
        this.verifyElementVisible(this.selectors.emptyCartMessage)
      } else {
        // Alternative way to check if cart is empty
        cy.get(this.selectors.cartRows).should('have.length', 0)
      }
    })
    return this
  }

  verifyCartIsNotEmpty() {
    cy.get(this.selectors.cartRows).should('have.length.greaterThan', 0)
    return this
  }

  // Product verification methods
  verifyProductInCart(productName, expectedDetails = {}) {
    const { price, quantity, total } = expectedDetails
    
    cy.get(this.selectors.cartRows).each(($row) => {
      cy.wrap($row).within(() => {
        cy.get(this.selectors.productDescription).invoke('text').then((name) => {
          if (name.trim() === productName) {
            cy.log(`Verifying product: ${productName}`)
            
            // Verify price if provided
            if (price) {
              cy.get(this.selectors.productPrice).should('contain', price)
            }
            
            // Verify quantity if provided
            if (quantity) {
              cy.get(this.selectors.productQuantity).should('have.value', quantity.toString())
            }
            
            // Verify total if provided
            if (total) {
              cy.get(this.selectors.productTotal).should('contain', total)
            }
          }
        })
      })
    })
    return this
  }

  getProductDetails(productIndex = 0) {
    return cy.get(this.selectors.cartRows).eq(productIndex).within(() => {
      const details = {}
      
      cy.get(this.selectors.productDescription).invoke('text').then((name) => {
        details.name = name.trim()
      })
      
      cy.get(this.selectors.productPrice).invoke('text').then((price) => {
        details.price = price.trim()
      })
      
      cy.get(this.selectors.productQuantity).invoke('val').then((quantity) => {
        details.quantity = parseInt(quantity)
      })
      
      cy.get(this.selectors.productTotal).invoke('text').then((total) => {
        details.total = total.trim()
      })
      
      return cy.wrap(details)
    })
  }

  // Cart manipulation methods
  updateProductQuantity(productIndex, newQuantity) {
    cy.get(this.selectors.cartRows).eq(productIndex).within(() => {
      cy.get(this.selectors.productQuantity)
        .clear()
        .type(newQuantity.toString())
        .blur() // Trigger change event
    })
    
    // Wait for quantity update to process
    cy.wait(2000)
    return this
  }

  removeProductFromCart(productIndex) {
    cy.get(this.selectors.cartRows).eq(productIndex).within(() => {
      cy.get(this.selectors.deleteButton).click()
    })
    
    // Wait for product removal
    cy.wait(2000)
    return this
  }

  removeProductByName(productName) {
    cy.get(this.selectors.cartRows).each(($row) => {
      cy.wrap($row).within(() => {
        cy.get(this.selectors.productDescription).invoke('text').then((name) => {
          if (name.trim() === productName) {
            cy.get(this.selectors.deleteButton).click()
            return false // Break the loop
          }
        })
      })
    })
    
    cy.wait(2000)
    return this
  }

  clearCart() {
    cy.get(this.selectors.cartRows).then(($rows) => {
      if ($rows.length > 0) {
        // Remove all items
        cy.get(this.selectors.deleteButton).each(($deleteBtn) => {
          cy.wrap($deleteBtn).click()
          cy.wait(1000) // Wait between deletions
        })
      }
    })
    return this
  }

  // Total calculation methods
  getCartTotal() {
    return cy.get(this.selectors.cartRows).then(($rows) => {
      let total = 0
      
      Array.from($rows).forEach((row) => {
        const totalText = Cypress.$(row).find(this.selectors.productTotal).text()
        const totalValue = parseFloat(totalText.replace(/[^\d.]/g, ''))
        total += totalValue
      })
      
      return total
    })
  }

  verifyCartTotalCalculation() {
    let calculatedTotal = 0
    
    cy.get(this.selectors.cartRows).each(($row) => {
      cy.wrap($row).within(() => {
        cy.get(this.selectors.productPrice).invoke('text').then((priceText) => {
          const price = parseFloat(priceText.replace(/[^\d.]/g, ''))
          
          cy.get(this.selectors.productQuantity).invoke('val').then((quantity) => {
            const qty = parseInt(quantity)
            calculatedTotal += price * qty
          })
        })
      })
    }).then(() => {
      // Compare with displayed total
      this.getCartTotal().then((displayedTotal) => {
        expect(calculatedTotal).to.be.closeTo(displayedTotal, 0.01)
      })
    })
    
    return this
  }

  // Checkout methods
  proceedToCheckout() {
    this.clickElement(this.selectors.proceedCheckoutBtn)
    return this
  }

  verifyCheckoutButton() {
    this.verifyElementVisible(this.selectors.proceedCheckoutBtn)
    this.verifyElementContainsText(this.selectors.proceedCheckoutBtn, 'Proceed To Checkout')
    return this
  }

  // Table structure verification
  verifyCartTableHeaders() {
    cy.get(this.selectors.cartTableHeader).within(() => {
      cy.contains('Item').should('be.visible')
      cy.contains('Description').should('be.visible')
      cy.contains('Price').should('be.visible')
      cy.contains('Quantity').should('be.visible')
      cy.contains('Total').should('be.visible')
    })
    return this
  }

  // Responsive design verification
  verifyMobileLayout() {
    cy.viewport(375, 667) // iPhone dimensions
    this.verifyElementVisible(this.selectors.cartTable)
    // Add mobile-specific verifications
    return this
  }

  verifyDesktopLayout() {
    cy.viewport(1280, 720) // Desktop dimensions
    this.verifyElementVisible(this.selectors.cartTable)
    this.verifyCartTableHeaders()
    return this
  }

  // Recommended items section
  verifyRecommendedItems() {
    this.scrollToElement(this.selectors.recommendedItems)
    this.verifyElementVisible(this.selectors.recommendedItems)
    return this
  }

  addRecommendedItem(itemIndex = 0) {
    cy.get(this.selectors.recommendedItems).within(() => {
      cy.get('.item .productinfo .btn').eq(itemIndex).click()
    })
    return this
  }

  // Breadcrumb navigation
  verifyBreadcrumb() {
    this.verifyElementVisible(this.selectors.breadcrumb)
    this.verifyElementContainsText(this.selectors.breadcrumb, 'Shopping Cart')
    return this
  }

  clickBreadcrumbHome() {
    cy.get(this.selectors.breadcrumb).contains('Home').click()
    return this
  }

  // Cart persistence verification
  verifyCartPersistence() {
    // Get current cart items
    this.getCartItemsCount().then((initialCount) => {
      // Navigate away and back
      cy.visit('/')
      cy.visit('/view_cart')
      
      // Verify items are still there
      this.getCartItemsCount().then((finalCount) => {
        expect(finalCount).to.equal(initialCount)
      })
    })
    return this
  }

  // Performance testing
  verifyPageLoadTime() {
    const startTime = Date.now()
    
    this.visit().then(() => {
      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(3000) // Should load within 3 seconds
    })
    
    return this
  }
}

module.exports = CartPage
