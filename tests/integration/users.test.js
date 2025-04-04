import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/user.model.js';

describe('User API Endpoints', () => {
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  let userId;

  // Connect to test database before all tests
  beforeAll(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Clear users collection
    await User.deleteMany({});
  });

  // Close database connection after all tests
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  // Test creating a new user
  it('should create a new user', async () => {
    const response = await request(app).post('/api/users').send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('name', testUser.name);
    expect(response.body.user).toHaveProperty('email', testUser.email);

    // Save user ID for later tests
    userId = response.body.user._id;
  });

  // Test fetching all users
  it('should fetch all users', async () => {
    const response = await request(app).get('/api/users');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users.length).toBeGreaterThan(0);
  });

  // Test fetching a specific user
  it('should fetch user by ID', async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('_id', userId);
    expect(response.body.user).toHaveProperty('name', testUser.name);
  });

  // Test updating a user
  it('should update a user', async () => {
    const updatedData = { name: 'Updated Name' };
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('name', updatedData.name);
    expect(response.body.user).toHaveProperty('email', testUser.email);
  });

  // Test deleting a user
  it('should delete a user', async () => {
    const response = await request(app).delete(`/api/users/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted');

    // Verify user no longer exists
    const checkUser = await request(app).get(`/api/users/${userId}`);
    expect(checkUser.statusCode).toBe(404);
  });
});
