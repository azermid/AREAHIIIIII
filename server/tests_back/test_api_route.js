const express = require('express');
const request = require('supertest');
const retryConnection = require('../source/database');


jest.mock('../source/repositories/UserRepository');
jest.mock('../source/services/AuthService');
jest.mock('../source/useCases/AuthenticateUser');
jest.mock('../source/useCases/RegisterUser');
jest.mock('../source/useCases/ThirdPartyLogin');
jest.mock('../source/controllers/UserController');

const UserRepository = require('../source/repositories/UserRepository');
const AuthService = require('../source/services/AuthService');
const AuthenticateUser = require('../source/useCases/AuthenticateUser');
const RegisterUser = require('../source/useCases/RegisterUser');
const ThirdPartyLogin = require('../source/useCases/ThirdPartyLogin');
const UserController = require('../source/controllers/UserController');
const routes = require('../source/routes/userRoutes');

describe('User Routes', () => {
  let app;
  let dbConnection;

  beforeEach(() => {
    dbConnection = {};
    app = express();
    app.use(express.json());
    app.use(routes(dbConnection));

    UserController.mockImplementation(() => ({
      login: jest.fn((req, res) => {
        if (req.body.username === 'user' && req.body.password === 'pass') {
          return res.status(200).json({ message: 'Logged in successfully' });
        }
        return res.status(401).json({ message: 'Invalid credentials' });
      }),
      register: jest.fn((req, res) => {
        return res.status(201).json({ message: 'User registered successfully' });
      }),
      thirdPartyLoginOrRegister: jest.fn((req, res) => {
        return res.status(200).json({ message: 'Third party login successful' });
      }),
    }));
  });

  // Tests pour la route de login
  describe('POST /login', () => {
    it('should log in successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'user', password: 'pass' });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Logged in successfully');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'user', password: 'wrong' });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  // Tests pour la route d'enregistrement
  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      const response = await request(app)
        .post('/register')
        .send({ username: 'newuser', password: 'newpass' });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });
  });

  // Tests pour la route de connexion via un tiers
  describe('POST /third-party-login', () => {
    it('should log in successfully via third party', async () => {
      const response = await request(app)
        .post('/third-party-login')
        .send({ token: 'some_token' });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Third party login successful');
    });
  });
});
