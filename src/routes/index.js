/* @flow */
const router = require('koa-router')();
const authRoutes = require('./auth');
const assertAuthenticatedMiddleware = require('../middlewares/assertAuthenticated');

router.get('/', async ctx => {
  ctx.body = { hello: true };
  return ctx;
});

router.post('/auth/login', authRoutes.login);
router.post('/auth/signup', authRoutes.signup);
router.post('/auth/logout', assertAuthenticatedMiddleware, authRoutes.logout);

module.exports = router;
