/**
 * Jest setup file for test configuration
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/restaurant-management-test';
process.env.SESSION_SECRET = 'test-secret-key';

// Increase timeout for database operations
jest.setTimeout(10000);
