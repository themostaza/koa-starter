/* @flow */
require('dotenv').config();
const allowCrossDomain = require('./allowCrossDomain');

test('adds cross domain headers', async () => {
  const ctx = {
    set: jest.fn(),
  };
  const next = jest.fn();
  await allowCrossDomain(ctx, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(ctx.set).toHaveBeenCalledTimes(3);
});
