import User from '../../src/models/user.model.js';
import mongoose from 'mongoose';

describe('User Model', () => {
  beforeAll(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Verify user is created
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);

    // Verify password is hashed
    expect(savedUser.password).not.toBe(userData.password);

    // Clean up
    await User.deleteOne({ _id: savedUser._id });
  });

  it('should fail validation when required fields are missing', async () => {
    const invalidUser = new User({});

    let error;
    try {
      await invalidUser.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should validate the email format', async () => {
    const invalidUser = new User({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    });

    let error;
    try {
      await invalidUser.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should correctly match passwords', async () => {
    const userData = {
      name: 'Test User',
      email: 'password-test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    // Test correct password
    const isMatch = await user.matchPassword(userData.password);
    expect(isMatch).toBe(true);

    // Test incorrect password
    const isNotMatch = await user.matchPassword('wrongpassword');
    expect(isNotMatch).toBe(false);

    // Clean up
    await User.deleteOne({ _id: user._id });
  });
});
