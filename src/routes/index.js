/* @flow */
const router = require('koa-router')();
const authRoutes = require('./auth');
const messagesRoutes = require('./messages');
const assertAuthenticated = require('../middlewares/assertAuthenticated');

router.get('/', async ctx => {
  ctx.body = { hello: true };
  return ctx;
});

router.post('/api/v1/auth/login', authRoutes.login);
router.post('/api/v1/auth/signup', authRoutes.signup);
router.post('/api/v1/auth/logout', assertAuthenticated, authRoutes.logout);
router.get('/api/v1/auth/verify', authRoutes.verify);
router.post('/api/v1/auth/forgot', authRoutes.forgot);
router.get('/api/v1/auth/reset', authRoutes.showResetPage);
router.post('/api/v1/auth/reset', authRoutes.reset);

router.post('/api/v1/messages', assertAuthenticated, messagesRoutes.createMessage);
router.delete('/api/v1/messages/:id', assertAuthenticated, messagesRoutes.deleteMessage);
router.get('/api/v1/messages', assertAuthenticated, messagesRoutes.getAllMessages);

module.exports = router;
