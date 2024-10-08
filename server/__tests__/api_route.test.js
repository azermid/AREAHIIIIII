const express = require('express');
const request = require('supertest');

describe('User Authentication Integration Tests', () => {
    let app;

    beforeAll(async () => {
      app = express();
      app.use(express.json());
    });

    describe('POST /login', () => {
        it('should log in successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'password' });

            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should return 400 for invalid password', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'wrongpassword' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid password');
        });

        it('should return 400 if user does not exist', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'nonexistentuser', password: 'password' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('User not found');
        });
    });
});
