/* @flow */
require('dotenv').config();
const constants = require('../config/constants');
const assertApiKeyProvided = require('./assertApiKeyProvided');

test('throws 401 when public api key is not provided', async () => {
  const ctx = {
    request: {
      headers: {},
    },
    params: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await assertApiKeyProvided(ctx, next);
  expect(next).toHaveBeenCalledTimes(0);
  expect(ctx.throw).toHaveBeenCalledWith(401);
});

test('calls next() when public api key is provided in headers', async () => {
  const ctx = {
    request: {
      headers: { 'x-app-public-api-key': constants.PUBLIC_API_KEY },
    },
    params: {},
    throw: jest.fn(),
  };
  const next = jest.fn();
  await assertApiKeyProvided(ctx, next);
  expect(next).toHaveBeenCalledTimes(1);
});

test('calls next() when public api key is provided in route params', async () => {
  const ctx = {
    request: {
      headers: {},
    },
    params: { publicApiKey: constants.PUBLIC_API_KEY },
    throw: jest.fn(),
  };
  const next = jest.fn();
  await assertApiKeyProvided(ctx, next);
  expect(next).toHaveBeenCalledTimes(1);
});
