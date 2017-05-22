/* @flow */
const router = require('koa-router')();
const authRoutes = require('./auth');
const assertApiKeyProvidedMiddleware = require('../middlewares/assertApiKeyProvided');
const assertAuthenticatedMiddleware = require('../middlewares/assertAuthenticated');

router.get('/public/:publicApiKey/test', async ctx => {
  ctx.body = { hello: true };
  return ctx;
});

router.post('/auth/login', authRoutes.login);
router.post('/auth/signup', authRoutes.signup);
router.post('/auth/logout', assertAuthenticatedMiddleware, authRoutes.logout);
router.get('/auth/:publicApiKey/verify', authRoutes.verify);
router.post('/auth/forgot', authRoutes.forgot);
router.get('/auth/:publicApiKey/reset', authRoutes.showResetPage);
router.post('/auth/reset', authRoutes.reset);

// https://github.com/alexmingoia/koa-router/issues/347
router.stack.forEach(routerItem => routerItem.stack.unshift(assertApiKeyProvidedMiddleware));

module.exports = router;
