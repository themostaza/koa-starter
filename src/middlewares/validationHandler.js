/* @flow */
const koaBouncer = require('koa-bouncer');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof koaBouncer.ValidationError) {
      ctx.throw(422, err.message);
    } else {
      throw err;
    }
  }
};
