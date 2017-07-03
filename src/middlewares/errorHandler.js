const koaBouncer = require('koa-bouncer');
const http = require('http');
const isNumber = require('lodash').isNumber;

module.exports = async (ctx, next) => {
  try {
    await next();
    if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404);
  } catch (err) {
    let status;
    if (err instanceof koaBouncer.ValidationError) {
      status = 422;
    } else {
      status = isNumber(err.status) ? err.status : 500;
    }
    ctx.type = 'application/json';
    ctx.body = {};
    ctx.status = status;
    ctx.body.error = {
      message: err.message || http.STATUS_CODES[status] || 'Internal server error',
      status: status,
    };
  }
};
