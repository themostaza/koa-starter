/* @flow */
const Koa = require('koa');
const loggerMiddleware = require('koa-logger')();
const bodyMiddleware = require('koa-body')();
const sessionMiddleware = require('koa-session');

const constants = require('./config/constants');
const router = require('./routes');
const userFromSessionMiddleware = require('./middlewares/userFromSession');

const app = new Koa();
app.poweredBy = false;
app.keys = [constants.COOKIE_KEY];

app.use(bodyMiddleware);
app.use(sessionMiddleware(app));
app.use(userFromSessionMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
