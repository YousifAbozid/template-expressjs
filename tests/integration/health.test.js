import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';

describe('Health Check Endpoint', () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  // Close database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 status and uptime', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('uptime');
    expect(typeof response.body.uptime).toBe('number');
  });
});
