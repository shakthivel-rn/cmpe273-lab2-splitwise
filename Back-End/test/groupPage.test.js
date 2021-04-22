const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET With Passport JWT Authentication /groupPage', () => {
  it('should succesfully return data of the group where the user is a member', (done) => {
    request
      .get('/groupPage')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmNjA0YmVlMWYzYmEwYTMxYmE0YjciLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg5NjEyNjgsImV4cCI6MTYxOTk2OTI2OH0.skqxTGmwRxbzzF1wdXd6n0ViyOiy0lzH8u3r0Phv-j8')
      .query({ userId: '607f604bee1f3ba0a31ba4b7', groupName: 'Daily' })
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          expenseId: '607f626bee1f3ba0a31ba4c7',
          expenseDescription: 'Dinner',
        },
        {
          expenseId: '607f611fee1f3ba0a31ba4be',
          expenseDescription: 'Lunch',
        },
        {
          expenseId: '607f60feee1f3ba0a31ba4bb',
          expenseDescription: 'Breakfast',
        },
      ], done);
  });
});
