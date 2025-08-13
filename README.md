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

## 📁 Project Structure

```
cypress/
├── e2e/                          # Test files
│   ├── login.cy.js              # Login functionality tests
│   ├── checkout-flow.cy.js      # End-to-end checkout tests
│   └── api-tests.cy.js          # API testing suite
├── fixtures/                     # Test data
│   ├── users.json               # User test data
│   ├── products.json            # Product test data
│   └── api.json                 # API endpoints & schemas
├── pages/                        # Page Object Model
│   ├── BasePage.js              # Base page with common methods
│   ├── HomePage.js              # Homepage interactions
│   ├── LoginPage.js             # Login page functionality
│   └── CartPage.js              # Shopping cart operations
├── support/                      # Support files
│   ├── e2e.js                   # Global configurations
│   └── commands/                # Custom commands
│       ├── auth.js              # Authentication commands
│       ├── cart.js              # Cart management commands
│       ├── navigation.js        # Navigation helpers
│       └── api.js               # API testing commands
└── utils/                        # Utility functions
    ├── testDataGenerator.js     # Dynamic test data generation
    └── helpers.js               # Common helper functions
```

## 🛠 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/demoCypress.git
cd demoCypress
```

2. Install dependencies:
```bash
npm install
```

3. Verify Cypress installation:
```bash
npx cypress verify
```

## 🧪 Running Tests

### Interactive Mode (Cypress Test Runner)
```bash
npm run cy:open
```

### Headless Mode
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:smoke
npm run test:api
npm run test:regression

# Run with specific browser
npm run test:chrome
npm run test:firefox
npm run test:edge

# Run on mobile viewport
npm run test:mobile
```

### Parallel Execution
```bash
npm run test:parallel
```

## 📊 Test Reports

### Generate HTML Reports
```bash
# Generate and open report
npm run report:open

# Just generate report
npm run report:merge
npm run report:generate
```

### Clean Reports
```bash
npm run clean:reports
```

## 🎯 Test Scenarios Covered

### 🔐 Authentication Tests
- ✅ Valid login scenarios
- ✅ Invalid credentials handling
- ✅ Form validation
- ✅ Session management
- ✅ Security testing (SQL injection, XSS)
- ✅ Cross-browser compatibility

### 🛒 E2E Checkout Flow
- ✅ Guest user checkout
- ✅ Registered user checkout
- ✅ Cart management during checkout
- ✅ Payment form validation
- ✅ Order confirmation
- ✅ Error scenario handling

### 🌐 API Testing
- ✅ Products API validation
- ✅ Search functionality
- ✅ User authentication API
- ✅ Data consistency checks
- ✅ Error handling
- ✅ Performance validation
- ✅ Security testing

## 🔧 Configuration

### Environment Variables
Set environment-specific configurations in `cypress.config.js`:

```javascript
env: {
  staging: {
    baseUrl: 'https://staging.automationexercise.com',
    apiUrl: 'https://staging.automationexercise.com/api'
  },
  production: {
    baseUrl: 'https://automationexercise.com',
    apiUrl: 'https://automationexercise.com/api'
  }
}
```

### Custom Commands Usage

```javascript
// Authentication
cy.login(email, password)
cy.loginViaAPI(email, password)
cy.logout()

// Cart Operations
cy.addToCart(productId, quantity)
cy.viewCart()
cy.clearCart()

// Navigation
cy.navigateTo('products')
cy.searchProducts('dress')

// API Testing
cy.getProductsAPI()
cy.verifyLoginAPI(email, password)
```

## 📈 CI/CD Integration

### GitHub Actions
The framework includes a comprehensive CI/CD pipeline:

- **Parallel execution** across multiple containers
- **Cross-browser testing** (Chrome, Firefox)
- **API tests** run separately
- **Smoke tests** on pull requests
- **Artifact collection** (screenshots, videos, reports)
- **Notifications** via Slack/Email

### Running in CI
```bash
# Set environment variables in GitHub Secrets
CYPRESS_RECORD_KEY=your_cypress_record_key
SLACK_WEBHOOK_URL=your_slack_webhook
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
```

## 🎛 Page Object Model

### BasePage Example
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

### LoginPage Usage
```javascript
const loginPage = new LoginPage()
loginPage
  .visitLoginPage()
  .performLogin(email, password)
  .verifySuccessfulLogin(username)
```

## 🧩 Custom Commands

### Authentication Commands
```javascript
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-qa="login-email"]').type(email)
  cy.get('[data-qa="login-password"]').type(password)
  cy.get('[data-qa="login-button"]').click()
})
```

## 📱 Mobile Testing

Run tests on mobile viewports:
```bash
npm run test:mobile
```

Or configure custom viewports:
```javascript
cy.viewport(375, 667) // iPhone dimensions
cy.viewport(768, 1024) // iPad dimensions
```

## 🚨 Error Handling

The framework includes comprehensive error handling:
- **Retry mechanisms** for flaky tests
- **Custom error messages** for better debugging
- **Screenshot capture** on failures
- **Video recordings** for analysis

## 🔄 Test Data Management

### Static Data (Fixtures)
```javascript
cy.fixture('users').then((users) => {
  const testUser = users.validUser
  cy.login(testUser.email, testUser.password)
})
```

### Dynamic Data Generation
```javascript
const TestDataGenerator = require('../utils/testDataGenerator')
const randomUser = TestDataGenerator.generateRandomUser()
```

## 🏷 Test Organization

### Using Tags
```javascript
describe('Login Tests', { tags: '@smoke' }, () => {
  it('should login successfully', { tags: '@critical' }, () => {
    // test code
  })
})
```

### Running Tagged Tests
```bash
npx cypress run --env grepTags=@smoke
npx cypress run --env grepTags="@smoke and @critical"
```

## 🐛 Debugging

### Debug Mode
```bash
DEBUG=cypress:* npm test
```

### Browser Developer Tools
- Set `debugger` statements in test code
- Use `cy.debug()` command
- Open browser dev tools during interactive mode

## 📚 Best Practices

1. **Use Page Object Model** for maintainable code
2. **Implement custom commands** for reusable functionality
3. **Use data-qa attributes** for reliable element selection
4. **Keep tests independent** and atomic
5. **Use proper waits** instead of hard delays
6. **Organize tests logically** with describe blocks
7. **Clean up test data** after each test
8. **Use meaningful test descriptions**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code structure
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Cypress Documentation](https://docs.cypress.io/)
- 💬 [GitHub Issues](https://github.com/your-username/demoCypress/issues)
- 📧 Email: qa-automation@company.com

## 🔄 Recent Updates

- **v1.0.0**: Initial framework setup with complete POM implementation
- Added comprehensive API testing suite
- Integrated Mochawesome reporting
- Added GitHub Actions CI/CD pipeline
- Implemented cross-browser testing support

---

**Built with ❤️ by the QA Automation Team**
