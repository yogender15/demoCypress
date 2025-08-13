// Base Page class with common functionality
class BasePage {
  constructor() {
    this.url = ''
  }

  // Navigation methods
  visit() {
    cy.visit(this.url)
    return this
  }

  getTitle() {
    return cy.title()
  }

  getCurrentURL() {
    return cy.url()
  }

  // Wait methods
  waitForPageLoad() {
    cy.get('body').should('be.visible')
    return this
  }

  waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible')
    return this
  }

  // Common element interactions
  clickElement(selector) {
    cy.get(selector).click()
    return this
  }

  typeText(selector, text) {
    cy.get(selector).clear().type(text)
    return this
  }

  selectOption(selector, option) {
    cy.get(selector).select(option)
    return this
  }

  checkCheckbox(selector) {
    cy.get(selector).check()
    return this
  }

  // Verification methods
  verifyElementExists(selector) {
    cy.get(selector).should('exist')
    return this
  }

  verifyElementVisible(selector) {
    cy.get(selector).should('be.visible')
    return this
  }

  verifyElementContainsText(selector, text) {
    cy.get(selector).should('contain', text)
    return this
  }

  verifyElementHasAttribute(selector, attribute, value) {
    cy.get(selector).should('have.attr', attribute, value)
    return this
  }

  // Scroll methods
  scrollToElement(selector) {
    cy.get(selector).scrollIntoView()
    return this
  }

  scrollToTop() {
    cy.scrollTo('top')
    return this
  }

  scrollToBottom() {
    cy.scrollTo('bottom')
    return this
  }

  // Screenshot methods
  takeScreenshot(name) {
    cy.screenshot(name)
    return this
  }

  // Wait methods
  wait(milliseconds) {
    cy.wait(milliseconds)
    return this
  }

  // Cookie methods
  setCookie(name, value) {
    cy.setCookie(name, value)
    return this
  }

  getCookie(name) {
    return cy.getCookie(name)
  }

  clearCookies() {
    cy.clearCookies()
    return this
  }

  // Local storage methods
  setLocalStorage(key, value) {
    cy.window().then((window) => {
      window.localStorage.setItem(key, value)
    })
    return this
  }

  getLocalStorage(key) {
    return cy.window().then((window) => {
      return window.localStorage.getItem(key)
    })
  }

  clearLocalStorage() {
    cy.clearLocalStorage()
    return this
  }

  // Alert methods
  handleAlert(action = 'accept') {
    if (action === 'accept') {
      cy.window().then((win) => {
        cy.stub(win, 'alert').returns(true)
      })
    }
    return this
  }

  // Network interception
  interceptRequest(method, url, alias) {
    cy.intercept(method, url).as(alias)
    return this
  }

  waitForRequest(alias) {
    cy.wait(`@${alias}`)
    return this
  }
}

module.exports = BasePage
