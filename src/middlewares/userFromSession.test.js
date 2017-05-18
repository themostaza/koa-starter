/* @flow */
require('dotenv').config();

const knex = require('../db/connection');
const userFromSession = require('./userFromSession');

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

test("doesn't do anything if a session token is not provided", async () => {
  const ctx = {
    headers: {},
    state: {},
  };
  const next = jest.fn();
  await userFromSession(ctx, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(ctx.state).toEqual({});
});

test('throws 400 if the session token is not a valid UUID', async () => {
  const ctx = {
    headers: { 'x-app-session-token': 'invalid' },
    state: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await userFromSession(ctx, next);
  expect(next).toHaveBeenCalledTimes(0);
  expect(ctx.throw).toHaveBeenCalledWith(400, 'Invalid session token');
  expect(ctx.state).toEqual({});
});

test('throws 401 if the sessionToken is not found', async () => {
  const ctx = {
    headers: { 'x-app-session-token': '123e4567-e89b-12d3-a456-426655440000' },
    state: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await userFromSession(ctx, next);
  expect(next).toHaveBeenCalledTimes(0);
  expect(ctx.throw).toHaveBeenCalledWith(401, 'Session expired, please log-in again');
  expect(ctx.state).toEqual({});
});

test("sets the user's info in state when authenticated", async () => {
  const ctx = {
    headers: { 'x-app-session-token': '932fb35f-623d-44bd-b180-77a71eca5054' },
    state: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await userFromSession(ctx, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(ctx.throw).toHaveBeenCalledTimes(0);
  expect(ctx.state).toEqual({
    currentUserId: 1,
    currentSessionId: '932fb35f-623d-44bd-b180-77a71eca5054',
  });
});
