/* @flow */
const router = require('koa-router')();
const bcrypt = require('bcrypt');
const passport = require('../passport');
const knex = require('../db/connection');

router.get('/', async ctx => {
  ctx.body = { ciao: true };
  return ctx;
});

router.post('/auth/login', async ctx => {
  try {
    await passport.authenticate('local', async (err, user, info) => {
      if (err) throw err;
      if (!user) throw new Error('User not found');
      if (user) {
        await ctx.login(user);
      }
      ctx.body = { user: user };
    })(ctx);
  } catch (err) {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

router.post('/auth/signup', async ctx => {
  const { email, password } = ctx.request.body;
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  try {
    await knex('users').insert({ email: email, password: hash }).returning('*');
    await passport.authenticate('local', async (err, user, info) => {
      if (!user) throw new Error('Invalid authentication');
      await ctx.login(user);
      ctx.body = { user: user };
    })(ctx);
  } catch (err) {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

module.exports = router;
