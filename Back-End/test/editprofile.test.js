const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('PUT With Passport JWT Authentication /profilePage', () => {
  it('should succesfully edit name', (done) => {
    request
      .put('/profilePage/editName')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmNjA0YmVlMWYzYmEwYTMxYmE0YjciLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg5NjEyNjgsImV4cCI6MTYxOTk2OTI2OH0.skqxTGmwRxbzzF1wdXd6n0ViyOiy0lzH8u3r0Phv-j8')
      .send({ userId: '607f604bee1f3ba0a31ba4b7', name: 'Admin' })
      .expect(200, done);
  });

  it('should succesfully edit email', (done) => {
    request
      .put('/profilePage/editEmail')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmNjA0YmVlMWYzYmEwYTMxYmE0YjciLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg5NjEyNjgsImV4cCI6MTYxOTk2OTI2OH0.skqxTGmwRxbzzF1wdXd6n0ViyOiy0lzH8u3r0Phv-j8')
      .send({ userId: '607f604bee1f3ba0a31ba4b7', email: 'admin@gmail.com' })
      .expect(200, done);
  });

  it('should return error for already used email', (done) => {
    request
      .put('/profilePage/editEmail')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmNjA0YmVlMWYzYmEwYTMxYmE0YjciLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg5NjEyNjgsImV4cCI6MTYxOTk2OTI2OH0.skqxTGmwRxbzzF1wdXd6n0ViyOiy0lzH8u3r0Phv-j8')
      .send({ userId: '607f604bee1f3ba0a31ba4b7', email: 'john@gmail.com' })
      .expect(400, done);
  });

  it('should succesfully edit phone number', (done) => {
    request
      .put('/profilePage/editPhoneNumber')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmNjA0YmVlMWYzYmEwYTMxYmE0YjciLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg5NjEyNjgsImV4cCI6MTYxOTk2OTI2OH0.skqxTGmwRxbzzF1wdXd6n0ViyOiy0lzH8u3r0Phv-j8')
      .send({ userId: '607f604bee1f3ba0a31ba4b7', phone: '123-456-7890' })
      .expect(200, done);
  });
});
