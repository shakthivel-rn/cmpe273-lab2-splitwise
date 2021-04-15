const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('PUT With Passport JWT Authentication /profilePage', () => {
  it('should succesfully edit name', (done) => {
    request
      .put('/profilePage/editName')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc3NGUyMmIzZmQ3YzQyZTgwMzQxZmEiLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg0MzQ3MjQsImV4cCI6MTYxOTQ0MjcyNH0.Fxsm8XfF56zcRnckWwNME9TxdfEKwAoTt6ARj1XrN1I')
      .send({ userId: '60774e22b3fd7c42e80341fa', name: 'Admin' })
      .expect(200, done);
  });

  it('should succesfully edit email', (done) => {
    request
      .put('/profilePage/editEmail')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc3NGUyMmIzZmQ3YzQyZTgwMzQxZmEiLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg0MzQ3MjQsImV4cCI6MTYxOTQ0MjcyNH0.Fxsm8XfF56zcRnckWwNME9TxdfEKwAoTt6ARj1XrN1I')
      .send({ userId: '60774e22b3fd7c42e80341fa', email: 'admin@gmail.com' })
      .expect(200, done);
  });

  it('should return error for already used email', (done) => {
    request
      .put('/profilePage/editEmail')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc3NGUyMmIzZmQ3YzQyZTgwMzQxZmEiLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg0MzQ3MjQsImV4cCI6MTYxOTQ0MjcyNH0.Fxsm8XfF56zcRnckWwNME9TxdfEKwAoTt6ARj1XrN1I')
      .send({ userId: '60774e22b3fd7c42e80341fa', email: 'john@gmail.com' })
      .expect(400, done);
  });

  it('should succesfully edit phone number', (done) => {
    request
      .put('/profilePage/editPhoneNumber')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc3NGUyMmIzZmQ3YzQyZTgwMzQxZmEiLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg0MzQ3MjQsImV4cCI6MTYxOTQ0MjcyNH0.Fxsm8XfF56zcRnckWwNME9TxdfEKwAoTt6ARj1XrN1I')
      .send({ userId: '60774e22b3fd7c42e80341fa', phone: '123-456-7890' })
      .expect(200, done);
  });
});
