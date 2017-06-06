/* @flow */
require('dotenv').config();
const responseDefaults = require('./responseDefaults');

test('sets ctx.body defaults succesfully', async () => {
  const ctx = {};
  const next = jest.fn();
  await responseDefaults(ctx, next);
  expect(ctx.body).toEqual({});
});
