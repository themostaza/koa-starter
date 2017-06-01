/* @flow */
const koaBouncer = require('koa-bouncer');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.type = 'application/json';
    if (err instanceof koaBouncer.ValidationError) {
      ctx.status = 422;
      ctx.body = {
        message: err.message || 'Validation error',
        status: 422,
      };
    } else {
      ctx.status = err.status;
      ctx.body = {
        message: err.message || 'Internal server error',
        status: err.status || 500,
      };
    }
  }
};
