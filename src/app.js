/* @flow */
const Koa = require('koa');
const loggerMiddleware = require('koa-logger')();
const bodyMiddleware = require('koa-body')();
const koaBouncer = require('koa-bouncer');

const router = require('./routes');
const userFromSessionMiddleware = require('./middlewares/userFromSession');
const validationHandlerMiddleware = require('./middlewares/validationHandler');

const app = new Koa();
app.poweredBy = false;

app.use(validationHandlerMiddleware);
app.use(bodyMiddleware);
app.use(koaBouncer.middleware());
app.use(userFromSessionMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
