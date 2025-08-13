<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Cypress E2E Testing Framework - Copilot Instructions

This is a comprehensive Cypress test automation framework for e-commerce applications with the following key characteristics:

## Framework Architecture
- **Page Object Model (POM)**: All page interactions are encapsulated in page classes extending from BasePage
- **Custom Commands**: Reusable functionality is implemented as Cypress custom commands in support/commands/
- **Test Data Management**: Uses fixtures for static data and utilities for dynamic data generation
- **API Testing**: Comprehensive API test coverage with validation and error handling
- **CI/CD Integration**: GitHub Actions workflow for automated testing

## Code Standards and Patterns

### Page Object Model
```javascript
// All page classes should extend BasePage
class LoginPage extends BasePage {
  constructor() {
    super()
    this.url = '/login'
    this.selectors = {
      loginEmail: '[data-qa="login-email"]',
      loginPassword: '[data-qa="login-password"]'
    }
  }
}
```

### Custom Commands
- Authentication commands in `support/commands/auth.js`
- Cart operations in `support/commands/cart.js`
- Navigation helpers in `support/commands/navigation.js`
- API testing commands in `support/commands/api.js`

### Test Structure
```javascript
describe('Feature Name', () => {
  let pageObject
  let testData

  beforeEach(() => {
    pageObject = new PageClass()
    cy.fixture('dataFile').then(data => testData = data)
  })

  it('should perform specific action', () => {
    // Arrange, Act, Assert pattern
  })
})
```

### Selector Strategy
- Prefer `data-qa` attributes for test selectors
- Use semantic selectors when data-qa not available
- Avoid CSS classes and IDs that may change

### Error Handling
- All page methods should return `this` for method chaining
- Use proper wait conditions instead of hard waits
- Implement retry logic for flaky operations

## File Organization

### Test Files (cypress/e2e/)
- Name test files with `.cy.js` extension
- Organize by feature/functionality
- Include comprehensive test scenarios

### Page Objects (cypress/pages/)
- One class per page
- Extend BasePage for common functionality
- Include verification methods

### Fixtures (cypress/fixtures/)
- JSON files for test data
- Separate by data type (users, products, api)
- Include both valid and invalid test scenarios

### Utilities (cypress/utils/)
- Helper functions for common operations
- Test data generators
- Validation utilities

## Testing Best Practices

### Test Independence
- Each test should be able to run independently
- Clean up test data after each test
- Use beforeEach for test setup

### Assertion Strategy
- Use meaningful assertion messages
- Verify both positive and negative scenarios
- Test edge cases and error conditions

### API Testing
- Validate response structure and data types
- Test error scenarios and status codes
- Verify data consistency across endpoints

### Cross-browser Testing
- Support Chrome, Firefox, and Edge
- Include mobile viewport testing
- Verify responsive design behavior

## Cypress Configuration
- Environment-specific configurations in `cypress.config.js`
- Reporter configuration for Mochawesome
- Custom tasks and event handlers

## CI/CD Integration
- GitHub Actions workflow supports parallel execution
- Artifact collection for screenshots, videos, and reports
- Environment-specific test execution
- Notification integration for Slack/Email

When generating code for this framework:
1. Follow the established patterns and architecture
2. Use the Page Object Model consistently
3. Implement proper error handling and retries
4. Include comprehensive test coverage
5. Follow the naming conventions and file organization
6. Add meaningful comments and documentation
7. Consider cross-browser compatibility
8. Implement both UI and API testing approaches
