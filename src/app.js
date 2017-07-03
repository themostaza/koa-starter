const Koa = require('koa');
const loggerMiddleware = require('koa-logger');
const bodyMiddleware = require('koa-body');
const helmetMiddleware = require('koa-helmet');
const koaBouncer = require('koa-bouncer');

const router = require('./routes');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const allowCrossDomainMiddleware = require('./middlewares/allowCrossDomain');

const constants = require('./config/constants');

const app = new Koa();
app.poweredBy = false;

if (!constants.IS_ENV_TEST) {
  app.use(loggerMiddleware());
}
app.use(helmetMiddleware());
app.use(allowCrossDomainMiddleware);
app.use(errorHandlerMiddleware);
app.use(bodyMiddleware());
app.use(koaBouncer.middleware());
app.use(router.routes());
app.use(router.allowedMethods(router.allowedMethods({ throw: true })));

module.exports = app;
