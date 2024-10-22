const request = require('supertest');

describe('User Authentication Integration Tests', () => {
    const serverUrl = 'http://localhost:8080';

    describe('POST /login', () => {
        it('should start successfully and return a 200 status code', async () => {
            const response = await request('http://localhost:8080').get('/health');
            expect(response.statusCode).toBe(200);
            expect(response.text).toBe('OK');
        });
        
        it('should log in successfully with valid credentials', async () => {
            const response = await request(serverUrl)
                .post('/user/login')
                .send({ username: 'testuser', password: 'password' });

            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should return 400 for invalid password', async () => {
            const response = await request(serverUrl)
                .post('/user/login')
                .send({ username: 'testuser', password: 'wrongpassword' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid password');
        });

        it('should return 400 if user does not exist', async () => {
            const response = await request(serverUrl)
                .post('/user/login')
                .send({ username: 'nonexistentuser', password: 'password' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('User not found');
        });
    });
});
