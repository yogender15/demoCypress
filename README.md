[![CI](https://github.com/yogender15/demoCypress/actions/workflows/ci.yml/badge.svg)](https://github.com/yogender15/demoCypress/actions/workflows/ci.yml)

# Cypress E2E Testing Framework

A comprehensive Cypress test automation framework for e-commerce applications, demonstrating best practices in QA automation testing.

## 🚀 Features

- **Complete Page Object Model (POM)** implementation
- **Custom Commands** for reusable functionality
- **API Testing** with comprehensive validation
- **Test Data Management** using fixtures
- **Environment-specific Configuration**
- **CI/CD Integration** with GitHub Actions
- **HTML Reports** with Mochawesome
- **Parallel Test Execution**
- **Cross-browser Testing** (Chrome, Firefox, Edge)
- **Mobile Responsive Testing**


# Cypress E2E & API Testing Framework

![Cypress](https://img.shields.io/badge/Cypress-14.x-brightgreen?logo=cypress)
![Node.js](https://img.shields.io/badge/Node.js-22.x-brightgreen?logo=node.js)

A robust, production-ready Cypress automation framework for e-commerce applications, focused on UI and API testing best practices.

---

## 🚀 Features

- Page Object Model (POM) for maintainable UI tests
- Custom Cypress commands for reusable actions
- Comprehensive API testing suite
- Fixtures for static test data
- Modern CI/CD with GitHub Actions
- HTML reporting with Mochawesome
- Cross-browser and mobile viewport support

---

## 📦 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yogender15/demoCypress.git
cd demoCypress

# 2. Install dependencies
npm install

# 3. Run all tests (headless)
npx cypress run --spec "cypress/e2e/framework-demo.cy.js,cypress/e2e/api-tests.cy.js" --browser chrome --headed

# 4. Open Cypress interactive runner
npx cypress open
```

---

## 📁 Project Structure

```
cypress/
├── e2e/
│   ├── framework-demo.cy.js      # UI framework demo tests
│   └── api-tests.cy.js          # API testing suite
├── fixtures/
│   ├── products.json             # Product test data
│   └── api.json                  # API endpoints & schemas
├── pages/
│   ├── BasePage.js              # Base page with common methods
│   ├── HomePage.js              # Homepage interactions
│   └── CartPage.js              # Shopping cart operations
├── support/
│   ├── e2e.js                   # Global configurations
│   └── commands/
│       ├── cart.js              # Cart management commands
│       ├── navigation.js        # Navigation helpers
│       └── api.js               # API testing commands
└── utils/
    ├── testDataGenerator.js     # Dynamic test data generation
    └── helpers.js               # Common helper functions
```

---

## 🧪 Running Tests

- **Headless (CI/CLI):**
  ```bash
  npx cypress run --spec "cypress/e2e/framework-demo.cy.js,cypress/e2e/api-tests.cy.js" --browser chrome --headed
  ```
- **Interactive:**
  ```bash
  npx cypress open
  ```

Test reports (HTML/JSON) are generated in `cypress/reports/` after each run.

---

## 📈 CI/CD Integration

GitHub Actions workflow runs only the two main test files in Chrome and Firefox, and uploads all reports and artifacts. See `.github/workflows/ci.yml` for details.

---

## 🔧 Configuration

Edit `cypress.config.js` for environment URLs, timeouts, and reporter settings.

---

## 🧩 Page Object Model Example

```javascript
class BasePage {
  visit() {
    cy.visit(this.url)
    return this
  }
  clickElement(selector) {
    cy.get(selector).click()
    return this
  }
}
```

---

## 📚 Best Practices

- Use POM for maintainable code
- Prefer custom commands for common actions
- Use `data-qa` attributes for selectors
- Keep tests atomic and independent
- Clean up test data after each test

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add or update tests
4. Submit a pull request

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Contact

- 📖 [Cypress Documentation](https://docs.cypress.io/)
- 💬 [GitHub Issues](https://github.com/yogender15/demoCypress/issues)
- 📧 Email: yogendermp15@outlook.com

---

**Built with ❤️ by Yogender Mummidi Prakash**
- Prefer custom commands for common actions
- Use `data-qa` attributes for selectors
- Keep tests atomic and independent
- Clean up test data after each test

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add or update tests
4. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Yogender Mummidi Prakash**
