/* @flow */
const uuid = require('uuid');
const cryptoUtils = require('../../utils/crypto');
const knex = require('../../db/connection');

// ========================
//   AUTH/SIGNUP
// ========================
const signup = async ctx => {
  const { email, password } = ctx.request.body;
  const hash = cryptoUtils.hashPassword(password);
  try {
    const [user] = await knex('users')
      .insert({ id: uuid.v4(), email: email, password: hash })
      .returning('*');
    const [session] = await knex('sessions')
      .insert({
        id: uuid.v4(),
        token: cryptoUtils.createSessionToken(),
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
      sessionToken: session.token,
    };
  } catch (err) {
    console.error(err.message);
    ctx.body = { error: err };
    ctx.throw(401);
  }
};

// ========================
//   AUTH/LOGIN
// ========================
const login = async ctx => {
  const { email, password } = ctx.request.body;
  try {
    const user = await knex('users').where({ email }).first().returning('*');
    if (!user || !cryptoUtils.checkPassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    const [session] = await knex('sessions')
      .insert({
        id: uuid.v4(),
        token: cryptoUtils.createSessionToken(),
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
    console.error(err.message);
    ctx.body = { error: err };
    ctx.throw(401);
  }
};

// ========================
//   AUTH/LOGOUT
// ========================
const logout = async ctx => {
  const { currentSessionToken, currentUser } = ctx.state;
  try {
    await knex('sessions')
      .where({ id: currentSessionToken, userId: currentUser.id })
      .update({ loggedOutAt: knex.raw(`now()`) });
    ctx.body = { success: true };
  } catch (err) {
    console.error(err.message);
    ctx.body = { error: err };
    ctx.throw(401);
  }
};

module.exports = {
  login,
  signup,
  logout,
};
