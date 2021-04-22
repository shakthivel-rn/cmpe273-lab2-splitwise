const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET With Passport JWT Authentication /dashboard/getGroupNames', () => {
  it('should succesfully return group names', (done) => {
    request
      .get('/dashboard/getGroupNames')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmNjA0YmVlMWYzYmEwYTMxYmE0YjciLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg5NjEyNjgsImV4cCI6MTYxOTk2OTI2OH0.skqxTGmwRxbzzF1wdXd6n0ViyOiy0lzH8u3r0Phv-j8')
      .query({ userId: '607f604bee1f3ba0a31ba4b7' })
      .expect(200, [
        { _id: '607f60d0ee1f3ba0a31ba4ba', name: 'Daily' },
        { _id: '607f6142ee1f3ba0a31ba4c2', name: 'Fun' },
      ], done);
  });
});
