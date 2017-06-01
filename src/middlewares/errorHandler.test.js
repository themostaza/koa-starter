/* @flow */
require('dotenv').config();
const koaBouncer = require('koa-bouncer');
const errorHandler = require('./errorHandler');

test('throws 422 when a koa-bouncer validation error happens', async () => {
  const ctx = {};
  const next = () => {
    throw new koaBouncer.ValidationError('test', 'Test error message');
  };
  await errorHandler(ctx, next);
  expect(ctx.body).toEqual({ status: 422, message: 'Test error message' });
});

test('throws 500 when a generic error happens', async () => {
  const ctx = {};
  const next = () => {
    throw new Error('Generic error');
  };
  await errorHandler(ctx, next);
  expect(ctx.body).toEqual({ status: 500, message: 'Generic error' });
});
