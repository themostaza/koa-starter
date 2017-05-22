/* @flow */
require('dotenv').config();
const mocks = require('../mocks');
const assertAuthenticated = require('./assertAuthenticated');

test('throws 401 when not authenticated', async () => {
  const ctx = {
    state: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await assertAuthenticated(ctx, next);
  expect(next).toHaveBeenCalledTimes(0);
  expect(ctx.throw).toHaveBeenCalledWith(401);
  expect(ctx.state).toEqual({});
});

test('calls next() when authenticated', async () => {
  const ctx = {
    headers: {},
    state: {
      currentUser: { id: mocks.user.id },
      currentSessionToken: mocks.session.token,
    },
    throw: jest.fn(),
  };
  const next = jest.fn();
  await assertAuthenticated(ctx, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(ctx.throw).toHaveBeenCalledTimes(0);
});
