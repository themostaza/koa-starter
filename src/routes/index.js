/* @flow */
const router = require('koa-router')();
const bcrypt = require('bcrypt');
const uuid = require('uuid');

// const passport = require('../passport');
const knex = require('../db/connection');

router.get('/', async ctx => {
  ctx.body = { ciao: true };
  return ctx;
});

const comparePass = (userPassword, databasePassword) => {
  return bcrypt.compareSync(userPassword, databasePassword);
};

router.post('/auth/login', async ctx => {
  const { email, password } = ctx.request.body;
  try {
    const user = await knex('users').where({ email }).first().returning('*');
    if (!user || !comparePass(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    const [session] = await knex('sessions')
      .insert({
        id: uuid.v4(),
        userId: user.id,
        ipAddress: ctx.ip,
        userAgent: ctx.headers['user-agent'],
      })
      .returning('*');
    ctx.body = {
      id: user.id,
      email: email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      sessionToken: session.id,
    };
  } catch (err) {
    console.log(err);
    ctx.body = { error: err };
    ctx.throw(401);
  }
});

router.post('/auth/signup', async ctx => {
  const { email, password } = ctx.request.body;
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  try {
    const [user] = await knex('users').insert({ email: email, password: hash }).returning('*');
    const [session] = await knex('sessions')
      .insert({
        id: uuid.v4(),
        userId: user.id,
        ipAddress: ctx.ip,
        userAgent: ctx.headers['user-agent'],
      })
      .returning('*');
    ctx.body = {
      id: user.id,
      email: email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      sessionToken: session.id,
    };
  } catch (err) {
    console.log(err);
    ctx.body = { error: err };
    ctx.throw(401);
  }
});

router.post('/auth/logout', async ctx => {
  const { currentSessionId, currentUserId } = ctx;
  try {
    await knex('sessions')
      .where({ id: currentSessionId, userId: currentUserId })
      .update({ loggedOutAt: knex.raw(`now()`) });
    ctx.body = { success: true };
  } catch (err) {
    ctx.body = { error: err };
    ctx.throw(401);
  }
});

module.exports = router;
