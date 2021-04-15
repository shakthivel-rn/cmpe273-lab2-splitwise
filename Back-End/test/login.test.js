const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('POST /login', () => {
  it('returns user data if user exist', (done) => {
    request
      .post('/login')
      .send({ email: 'admin@gmail.com', password: 'Admin12345' })
      .expect(200, done);
  });

  it('testing invalid login', () => {
    request
      .post('/login')
      .send({ email: 'admin@gmail.com', password: 'admin1' })
      .expect(500);
  });
});
