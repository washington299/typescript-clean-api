import request from 'supertest';
import app from '../config/app';

describe('Signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Washington',
        email: 'washington123@email.com',
        password: '123',
        confirmPassword: '123',
      })
      .expect(200);
  });
});
