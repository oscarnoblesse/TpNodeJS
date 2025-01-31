const request = require('supertest');
const app = require('./app'); // Adjust the path as necessary
const { createConnection, getConnection } = require('typeorm');

beforeAll(async () => {
    await createConnection(); // Ensure your new database connection is established
});

afterAll(async () => {
    await getConnection().close(); // Close the connection after tests
});

describe('App Controller', () => {
    it('should return a response from the controller', async () => {
        const response = await request(app).get('/your-endpoint'); // Replace with your actual endpoint
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data'); // Adjust based on your expected response
    });
});