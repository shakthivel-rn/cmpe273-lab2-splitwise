const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET With Passport JWT Authentication /dashboard/getGroupNames', () => {
  it('should succesfully return group names', (done) => {
    request
      .get('/dashboard/getGroupNames')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc3NGUyMmIzZmQ3YzQyZTgwMzQxZmEiLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg0MzQ3MjQsImV4cCI6MTYxOTQ0MjcyNH0.Fxsm8XfF56zcRnckWwNME9TxdfEKwAoTt6ARj1XrN1I')
      .query({ userId: '60774e22b3fd7c42e80341fa' })
      .expect(200, done);
  });
});
