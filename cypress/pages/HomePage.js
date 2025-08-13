const BasePage = require('./BasePage')

class HomePage extends BasePage {
  constructor() {
    super()
    this.url = '/'
    
    // Selectors
    this.selectors = {
      logo: '.logo img',
      navigationMenu: '.navbar-nav',
      homeLink: 'a[href="/"]',
      productsLink: 'a[href="/products"]',
      cartLink: 'a[href="/view_cart"]',
      contactLink: 'a[href="/contact_us"]',
      testCasesLink: 'a[href="/test_cases"]',
      logoutLink: 'a[href="/logout"]',
      deleteAccountLink: 'a[href="/delete_account"]',
      
      // Hero section
      heroSection: '.carousel',
      heroSlide: '.carousel-inner .item',
      
      // Features section
      featuresSection: '.features_items',
      featureProducts: '.features_items .col-sm-4',
      productItem: '.productinfo',
      productName: '.productinfo p',
      productPrice: '.productinfo h2',
      addToCartBtn: '.productinfo .btn',
      viewProductBtn: '.choose .nav-pills li a',
      
      // Categories
      categoriesPanel: '.left-sidebar .category-products',
      categoryLinks: '.panel-body ul li a',
      
      // Brands
      brandsPanel: '.brands_products',
      brandLinks: '.brands_products ul li a',
      
      // Footer
      footer: '#footer',
      footerLinks: '#footer a',
      subscriptionEmail: '#susbscribe_email',
      subscribeBtn: '#subscribe',
      
      // Scroll up
      scrollUpBtn: '#scrollUp'
    }
  }

  // Navigation methods
  visitHomePage() {
    this.visit()
    this.verifyHomePage()
    return this
  }

  verifyHomePage() {
    this.verifyElementVisible(this.selectors.logo)
    this.verifyElementVisible(this.selectors.featuresSection)
    this.getCurrentURL().should('not.include', '/login')
    return this
  }

  // Navigation bar interactions
  clickProducts() {
    this.clickElement(this.selectors.productsLink)
    return this
  }

  clickCart() {
    this.clickElement(this.selectors.cartLink)
    return this
  }


  clickContact() {
    this.clickElement(this.selectors.contactLink)
    return this
  }

  clickLogout() {
    this.clickElement(this.selectors.logoutLink)
    return this
  }

  // Product interactions
  getProductsCount() {
    return cy.get(this.selectors.featureProducts).its('length')
  }

  clickProductByIndex(index) {
    cy.get(this.selectors.featureProducts)
      .eq(index)
      .find(this.selectors.viewProductBtn)
      .click()
    return this
  }

  addProductToCartByIndex(index) {
    cy.get(this.selectors.featureProducts)
      .eq(index)
      .find(this.selectors.addToCartBtn)
      .click()
    return this
  }

  getProductNameByIndex(index) {
    return cy.get(this.selectors.featureProducts)
      .eq(index)
      .find(this.selectors.productName)
      .invoke('text')
  }

  getProductPriceByIndex(index) {
    return cy.get(this.selectors.featureProducts)
      .eq(index)
      .find(this.selectors.productPrice)
      .invoke('text')
  }

  // Hero carousel interactions
  verifyHeroCarousel() {
    this.verifyElementVisible(this.selectors.heroSection)
    return this
  }

  clickNextSlide() {
    cy.get('.carousel-control-next').click()
    return this
  }

  clickPrevSlide() {
    cy.get('.carousel-control-prev').click()
    return this
  }

  // Categories interactions
  clickCategory(categoryName) {
    cy.get(this.selectors.categoriesPanel)
      .contains(categoryName)
      .click()
    return this
  }

  clickSubcategory(subcategoryName) {
    cy.get(this.selectors.categoryLinks)
      .contains(subcategoryName)
      .click()
    return this
  }

  verifyCategorySection() {
    this.verifyElementVisible(this.selectors.categoriesPanel)
    cy.get(this.selectors.categoriesPanel).invoke('text').then(text => {
      const upperText = text.toUpperCase()
      const categories = ['WOMEN', 'MEN', 'KIDS']
      const found = categories.some(cat => upperText.includes(cat))
      expect(found, `Sidebar should contain at least one known category: ${categories.join(', ')}`).to.be.true
    })
    return this
  }

  // Brands interactions
  clickBrand(brandName) {
    cy.get(this.selectors.brandsPanel)
      .contains(brandName)
      .click()
    return this
  }

  verifyBrandsSection() {
    this.verifyElementVisible(this.selectors.brandsPanel)
    this.verifyElementContainsText(this.selectors.brandsPanel, 'Brands')
    return this
  }

  // Footer interactions
  subscribeToNewsletter(email) {
    this.typeText(this.selectors.subscriptionEmail, email)
    this.clickElement(this.selectors.subscribeBtn)
    return this
  }

  verifyFooter() {
    this.verifyElementVisible(this.selectors.footer)
    return this
  }

  clickFooterLink(linkText) {
    cy.get(this.selectors.footer)
      .contains(linkText)
      .click()
    return this
  }

  // Scroll interactions
  scrollToTop() {
    this.scrollToElement('body')
    return this
  }

  clickScrollUpButton() {
    this.clickElement(this.selectors.scrollUpBtn)
    return this
  }

  verifyScrollUpButton() {
    this.scrollToBottom()
    this.verifyElementVisible(this.selectors.scrollUpBtn)
    return this
  }

  // User account interactions
  verifyLoggedInUser(username) {
    this.verifyElementContainsText(this.selectors.navigationMenu, `Logged in as ${username}`)
    return this
  }

  deleteAccount() {
    this.clickElement(this.selectors.deleteAccountLink)
    return this
  }

  // Search functionality (if available on homepage)
  searchProduct(searchTerm) {
    // This would depend on if search is available on homepage
    cy.get('body').then(($body) => {
      if ($body.find('#search_product').length > 0) {
        this.typeText('#search_product', searchTerm)
        this.clickElement('#submit_search')
      }
    })
    return this
  }

  // Modal handling
  handleAddToCartModal(action = 'continue') {
    cy.get('#cartModal').should('be.visible')
    
    if (action === 'continue') {
      cy.get('.modal-footer .btn-success').click()
    } else if (action === 'view_cart') {
      cy.get('.modal-footer .btn-info').click()
    }
    
    cy.get('#cartModal').should('not.be.visible')
    return this
  }

  // Verification methods specific to homepage
  verifyFeaturedProductsSection() {
    this.verifyElementVisible(this.selectors.featuresSection)
    this.verifyElementContainsText(this.selectors.featuresSection, 'Features Items')
    
    // Verify at least some products are displayed
    cy.get(this.selectors.featureProducts).should('have.length.greaterThan', 0)
    return this
  }

  verifyRecommendedItemsSection() {
    this.scrollToElement('#recommended-item-carousel')
    this.verifyElementVisible('#recommended-item-carousel')
    return this
  }
}

module.exports = HomePage
