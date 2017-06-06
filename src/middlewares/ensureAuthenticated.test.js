/* @flow */
require('dotenv').config();
const knex = require('../db/connection');
const mocks = require('../mocks');
const ensureAuthenticated = require('./ensureAuthenticated');

beforeEach(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();
});

afterEach(async () => {
  await knex.migrate.rollback();
});

afterAll(async () => {
  await knex.destroy();
});

test('throws 401 if the sessionToken is not provided', async () => {
  const ctx = {
    headers: {},
    state: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await ensureAuthenticated(ctx, next);
  expect(next).toHaveBeenCalledTimes(0);
  expect(ctx.throw).toHaveBeenCalledWith(401, 'Missing session token');
  expect(ctx.state).toEqual({});
});

test('throws 401 if the sessionToken is not found', async () => {
  const ctx = {
    headers: { 'X-App-Session-Token': '123456789' },
    state: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await ensureAuthenticated(ctx, next);
  expect(next).toHaveBeenCalledTimes(0);
  expect(ctx.throw).toHaveBeenCalledWith(401, 'Session expired, please log-in again');
  expect(ctx.state).toEqual({});
});

test("sets the user's info in state when authenticated", async () => {
  const ctx = {
    headers: { 'X-App-Session-Token': mocks.session.token },
    state: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await ensureAuthenticated(ctx, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(ctx.throw).toHaveBeenCalledTimes(0);
  expect(ctx.state.currentSessionToken).toBe(mocks.session.token);
  expect(ctx.state.currentUser.id).toBe(mocks.user.id);
  expect(ctx.state.currentUser.email).toBe(mocks.user.email);
});
