/* @flow */
require('dotenv').config();
const koaBouncer = require('koa-bouncer');
const validationHandler = require('./validationHandler');

test('throws 422 when a koa-bouncer validation error happens', async () => {
  const ctx = {
    throw: jest.fn(),
  };
  const next = () => {
    throw new koaBouncer.ValidationError('test', 'Test error message');
  };
  await validationHandler(ctx, next);
  expect(ctx.throw).toHaveBeenCalledWith(422, 'Test error message');
});
