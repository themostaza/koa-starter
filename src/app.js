/* @flow */
const Koa = require('koa');
const koaLogger = require('koa-logger')();
const koaBody = require('koa-body')();
const koaSession = require('koa-session');

const constants = require('./config/constants');
const passport = require('./passport');
const router = require('./routes');

const app = new Koa();
app.poweredBy = false;
app.keys = [constants.COOKIE_KEY];

app.use(koaBody);
app.use(koaSession(app));
app.use(passport.initialize());
app.use(passport.session());
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
