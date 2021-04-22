const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET With Passport JWT Authentication /recentActivity', () => {
  it('should succesfully return recent activity of the user', (done) => {
    request
      .get('/recentActivity')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmNjA0YmVlMWYzYmEwYTMxYmE0YjciLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg5NjEyNjgsImV4cCI6MTYxOTk2OTI2OH0.skqxTGmwRxbzzF1wdXd6n0ViyOiy0lzH8u3r0Phv-j8')
      .query({
        userId: '607f604bee1f3ba0a31ba4b7', pageNumber: 1, pageSize: 2, order: 'desc', selectedGroup: 'All',
      })
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          expenseName: 'Dinner',
          expenseAmount: 80,
          groupName: 'Daily',
          paidUserName: 'Jack',
          owedUserName: 'John',
          splitAmount: 26.67,
          status: 'owes',
        },
        {
          expenseName: 'Dinner',
          expenseAmount: 80,
          groupName: 'Daily',
          paidUserName: 'Jack',
          owedUserName: 'Jack',
          splitAmount: 26.67,
          status: 'added',
        },
      ], done);
  });
});
