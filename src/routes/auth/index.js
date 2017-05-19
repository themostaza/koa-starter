/* @flow */
const uuid = require('uuid');
const validator = require('validator');
const cryptoUtils = require('../../utils/crypto');
const knex = require('../../db/connection');

// ========================
//   AUTH/SIGNUP
// ========================
const signup = async ctx => {
  if (!ctx.request.body) {
    ctx.throw(400, 'Invalid request body');
  }
  if (!ctx.request.body.email) {
    ctx.throw(400, 'Required field: email');
  }
  if (!ctx.request.body.password) {
    ctx.throw(400, 'Required field: password');
  }
  if (!validator.isEmail(ctx.request.body.email)) {
    ctx.throw(400, 'Invalid email');
  }
  if (!validator.isLength(ctx.request.body.password, { min: 8, max: 32 })) {
    ctx.throw(400, 'Password lenght must be between 8 and 32 characters');
  }
  const email = ctx.request.body.email.trim().toLowerCase();
  const password = ctx.request.body.password;
  const isEmailAlreadyInUse = await knex('users').where({ email }).first();
  if (isEmailAlreadyInUse) {
    ctx.throw(409, 'Email already in use');
  }
  const hash = cryptoUtils.hashPassword(password);
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
};

// ========================
//   AUTH/LOGIN
// ========================
const login = async ctx => {
  if (!ctx.request.body) {
    ctx.throw(400, 'Invalid request body');
  }
  if (!ctx.request.body.email) {
    ctx.throw(400, 'Required field: email');
  }
  if (!ctx.request.body.password) {
    ctx.throw(400, 'Required field: password');
  }
  const email = ctx.request.body.email.trim().toLowerCase();
  const password = ctx.request.body.password;
  const user = await knex('users').where({ email }).first();
  if (!user || !cryptoUtils.checkPassword(password, user.password)) {
    ctx.throw(401, 'Invalid credentials');
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
};

// ========================
//   AUTH/LOGOUT
// ========================
const logout = async ctx => {
  const { currentSessionToken, currentUser } = ctx.state;
  await knex('sessions')
    .where({ id: currentSessionToken, userId: currentUser.id })
    .update({ loggedOutAt: knex.raw(`now()`) });
  ctx.body = { success: true };
};

module.exports = {
  login,
  signup,
  logout,
};
