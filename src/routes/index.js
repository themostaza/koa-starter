const router = require('koa-router')();
const auth = require('./auth');
const user = require('./user');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

router.get('/', async ctx => {
  ctx.body = { hello: true };
});

router.post('/auth/login', auth.login);
router.post('/auth/signup', auth.signup);
router.post('/auth/logout', ensureAuthenticated, auth.logout);
router.get('/auth/verify', auth.verify);
router.post('/auth/forgot', auth.forgot);
router.get('/auth/reset', auth.showResetPage);
router.post('/auth/reset', auth.reset);

router.get('/user', ensureAuthenticated, user.getUser);

module.exports = router;
