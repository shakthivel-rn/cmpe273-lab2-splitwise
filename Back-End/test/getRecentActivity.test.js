const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET With Passport JWT Authentication /recentActivity', () => {
  it('should succesfully return recent activity of the user', (done) => {
    request
      .get('/recentActivity')
      .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc3NGUyMmIzZmQ3YzQyZTgwMzQxZmEiLCJuYW1lIjoiQWRtaW4iLCJpYXQiOjE2MTg0MzQ3MjQsImV4cCI6MTYxOTQ0MjcyNH0.Fxsm8XfF56zcRnckWwNME9TxdfEKwAoTt6ARj1XrN1I')
      .query({
        userId: '60774e22b3fd7c42e80341fa', pageNumber: 1, pageSize: 2, order: 'desc', selectedGroup: 'All',
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
