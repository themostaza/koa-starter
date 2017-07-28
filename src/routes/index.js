const router = require('koa-router')();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const messageRoutes = require('./message');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

router.get('/', async ctx => {
  ctx.body = { hello: true };
});

router.post('/auth/login', authRoutes.login);
router.post('/auth/signup', authRoutes.signup);
router.post('/auth/logout', ensureAuthenticated, authRoutes.logout);
router.get('/auth/verify', authRoutes.verify);
router.post('/auth/forgot', authRoutes.forgot);
router.get('/auth/reset', authRoutes.showResetPage);
router.post('/auth/reset', authRoutes.reset);

router.get('/user', ensureAuthenticated, userRoutes.getUser);

router.get('/messages', messageRoutes.getMessages);
router.get('/messages/:id', messageRoutes.getMessage);
router.post('/messages', ensureAuthenticated, messageRoutes.createMessage);
router.patch('/messages/:id', ensureAuthenticated, messageRoutes.updateMessage);
router.delete('/messages/:id', ensureAuthenticated, messageRoutes.deleteMessage);

module.exports = router;
