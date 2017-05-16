require('dotenv').config();
const Koa = require('koa');
const koaHelmet = require('koa-helmet');
const koaCompress = require('koa-compress');
const koaBody = require('koa-body');
const constants = require('./config/constants');
const koaSession = require('koa-session');
const koaPassport = require('koa-passport');
const koaRouter = require('koa-router')();

const app = new Koa();
app.poweredBy = false;
app.keys([constants.COOKIE_KEY]);

app.use(koaSession({}, app));
app.use(koaHelmet);
app.use(koaCompress);
app.use(koaBody);
app.use(koaPassport.initialize());
app.use(koaPassport.session());

koaRouter.post('/login', async ctx => {});

koaRouter.post('/signup', async ctx => {});

app.use(koaRouter);

app.listen(constants.PORT, () => {
  console.log('Listening on port ', constants.PORT);
});
