const router = require('koa-router')();
const authRoutes = require('./auth');
const messagesRoutes = require('./messages');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

router.get('/', async ctx => {
  ctx.body = { hello: true };
  return ctx;
});

router.post('/api/v1/auth/login', authRoutes.login);
router.post('/api/v1/auth/signup', authRoutes.signup);
router.post('/api/v1/auth/logout', ensureAuthenticated, authRoutes.logout);
router.get('/api/v1/auth/verify', authRoutes.verify);
router.post('/api/v1/auth/forgot', authRoutes.forgot);
router.get('/api/v1/auth/reset', authRoutes.showResetPage);
router.post('/api/v1/auth/reset', authRoutes.reset);

router.post('/api/v1/messages', ensureAuthenticated, messagesRoutes.createMessage);
router.delete('/api/v1/messages/:id', ensureAuthenticated, messagesRoutes.deleteMessage);
router.get('/api/v1/messages', ensureAuthenticated, messagesRoutes.getAllMessages);

module.exports = router;
