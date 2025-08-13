// Test data generation utilities

class TestDataGenerator {
  /**
   * Generate random email address
   * @param {string} domain - Email domain (default: 'example.com')
   * @returns {string} Random email address
   */
  static generateRandomEmail(domain = 'example.com') {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    return `testuser_${timestamp}_${randomNum}@${domain}`
  }

  /**
   * Generate random user data
   * @returns {Object} Random user object
   */
  static generateRandomUser() {
    const timestamp = Date.now()
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    
    return {
      name: `${firstName} ${lastName}`,
      email: this.generateRandomEmail(),
      password: 'TestPassword123!',
      title: Math.random() > 0.5 ? 'Mr' : 'Ms',
      dateOfBirth: {
        day: Math.floor(Math.random() * 28) + 1,
        month: Math.floor(Math.random() * 12) + 1,
        year: Math.floor(Math.random() * 50) + 1970
      },
      firstName: firstName,
      lastName: lastName,
      company: `${firstName} Corp`,
      address1: `${Math.floor(Math.random() * 9999) + 1} Test Street`,
      address2: `Apt ${Math.floor(Math.random() * 100) + 1}`,
      country: 'United States',
      state: 'California',
      city: 'Test City',
      zipcode: `${Math.floor(Math.random() * 90000) + 10000}`,
      mobileNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }
  }

  /**
   * Generate random string
   * @param {number} length - Length of string
   * @param {string} charset - Character set to use
   * @returns {string} Random string
   */
  static generateRandomString(length = 10, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
  }

  /**
   * Generate random number within range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static generateRandomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Generate random phone number
   * @param {string} format - Phone number format
   * @returns {string} Random phone number
   */
  static generateRandomPhoneNumber(format = 'US') {
    switch (format.toUpperCase()) {
      case 'US':
        return `+1${this.generateRandomNumber(100, 999)}${this.generateRandomNumber(100, 999)}${this.generateRandomNumber(1000, 9999)}`
      case 'UK':
        return `+44${this.generateRandomNumber(1000000000, 9999999999)}`
      default:
        return `+1${this.generateRandomNumber(1000000000, 9999999999)}`
    }
  }

  /**
   * Generate random date
   * @param {Date} startDate - Start date range
   * @param {Date} endDate - End date range
   * @returns {Date} Random date
   */
  static generateRandomDate(startDate = new Date(1970, 0, 1), endDate = new Date()) {
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
  }

  /**
   * Generate random address
   * @returns {Object} Random address object
   */
  static generateRandomAddress() {
    const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Cedar Ln', 'Park Ave', 'First St', 'Second St']
    const cities = ['Springfield', 'Riverside', 'Franklin', 'Greenville', 'Bristol', 'Fairview', 'Salem', 'Georgetown']
    const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA']
    
    return {
      address1: `${this.generateRandomNumber(1, 9999)} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`,
      address2: Math.random() > 0.5 ? `Apt ${this.generateRandomNumber(1, 999)}` : '',
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipcode: this.generateRandomNumber(10000, 99999).toString(),
      country: 'United States'
    }
  }

  /**
   * Generate test credit card data
   * @returns {Object} Test credit card object
   */
  static generateTestCreditCard() {
    const cardTypes = [
      { name: 'Visa', prefix: '4', length: 16 },
      { name: 'MasterCard', prefix: '5', length: 16 },
      { name: 'American Express', prefix: '37', length: 15 }
    ]
    
    const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)]
    let cardNumber = cardType.prefix
    
    while (cardNumber.length < cardType.length) {
      cardNumber += Math.floor(Math.random() * 10)
    }
    
    const expiryMonth = this.generateRandomNumber(1, 12).toString().padStart(2, '0')
    const expiryYear = (new Date().getFullYear() + this.generateRandomNumber(1, 5)).toString()
    const cvv = this.generateRandomNumber(100, 999).toString()
    
    return {
      cardNumber: cardNumber,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      cvv: cvv,
      cardType: cardType.name,
      cardHolderName: `${this.generateRandomString(5).toUpperCase()} ${this.generateRandomString(7).toUpperCase()}`
    }
  }

  /**
   * Generate bulk test data
   * @param {number} count - Number of items to generate
   * @param {string} type - Type of data to generate
   * @returns {Array} Array of generated data
   */
  static generateBulkData(count = 10, type = 'user') {
    const data = []
    
    for (let i = 0; i < count; i++) {
      switch (type.toLowerCase()) {
        case 'user':
          data.push(this.generateRandomUser())
          break
        case 'email':
          data.push(this.generateRandomEmail())
          break
        case 'address':
          data.push(this.generateRandomAddress())
          break
        case 'creditcard':
          data.push(this.generateTestCreditCard())
          break
        default:
          data.push(this.generateRandomUser())
      }
    }
    
    return data
  }
}

module.exports = TestDataGenerator
