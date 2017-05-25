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
router.get('/auth/verify', authRoutes.verify);
router.post('/auth/forgot', authRoutes.forgot);
router.get('/auth/reset', authRoutes.showResetPage);
router.post('/auth/reset', authRoutes.reset);

module.exports = router;
