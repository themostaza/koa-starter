/* @flow */
const uuid = require('uuid');
const validator = require('validator');
const cryptoUtils = require('../../utils/crypto');
const mandrillService = require('../../services/mandrill');
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
  const token = cryptoUtils.createVerifyAccountToken();
  // TODO: Update this string with a BASE_URL maybe?
  const url = `http://${ctx.headers.host}/auth/verify?token=${token}&email=${email}`;
  await mandrillService.sendVerifyAccountEmail(email, url);
  ctx.body = { success: true };
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

// ========================
//   AUTH/VERIFY
// ========================
const verify = async ctx => {
  if (!ctx.request.query || !ctx.request.query.token || !ctx.request.query.email) {
    ctx.throw(400, 'Invalid request query');
  }
  const email = ctx.request.query.email.trim().toLowerCase();
  const token = ctx.request.query.token;
  const updateResult = await knex('users')
    .where({ email: email, verifyEmailToken: token })
    .update({
      emailVerified: true,
      verifyEmailToken: null,
    })
    .returning('*');
  const updatedUser = updateResult[0];
  if (!updatedUser) {
    ctx.throw(400, 'Invalid url');
  }
  ctx.body = {
    success: true,
  };
};

// ========================
//   AUTH/FORGOT
// ========================
// const forgot = async ctx => {
//   if (!ctx.request.body) {
//     ctx.throw(400, 'Invalid request body');
//   }
//   if (!ctx.request.body.email) {
//     ctx.throw(400, 'Required field: email');
//   }
//   if (!validator.isEmail(ctx.request.body.email)) {
//     ctx.throw(400, 'Invalid email');
//   }
//   const email = ctx.request.body.email.trim().toLowerCase();
//   const user = await knex('users').where({ email }).first();
//   if (!user) {
//     ctx.throw(404, 'User not found.');
//   }
//   const token = cryptoUtils.createResetPasswordToken();
//   await knex('users').where({ id: user.id }).update({
//     resetPasswordToken: token,
//     resetPasswordTokenExpiresAt: knex.raw(`NOW() + INTERVAL '1 hour'`),
//   });
//   // TODO: Update this string with a BASE_URL maybe?
//   const url = `http://${ctx.headers.host}/auth/reset?token=${token}&email=${email}`;
//   await mandrillService.sendPasswordResetEmail(email, url);
//   ctx.body = {
//     success: true,
//   };
// };

// ========================
//   AUTH/RESET
// ========================
// const reset = async ctx => {
//   if (!ctx.request.query || !ctx.request.query.token || !ctx.query.request.email) {
//     ctx.throw(400, 'Invalid request query');
//   }
//   const email = ctx.request.query.email.trim().toLowerCase();
//   const token = ctx.request.query.token;
//   const user = await knex('users')
//     .where({ email, resetPasswordToken: token })
//     .andWhere('resetPasswordTokenExpiresAt', '<', knex.raw(`now()`))
//     .first();
//   if (!user) {
//     ctx.throw(400, 'Password reset token is invalid or has expired.');
//   }
//   const password = cryptoUtils.createTemporaryPassword();
//   const hash = cryptoUtils.hashPassword(password);
//   await knex('users').where({ id: user.id }).update({
//     password: hash,
//     resetPasswordToken: null,
//     resetPasswordTokenExpiresAt: null,
//   });
//   // TODO: What are we gonna do?
//   ctx.body = {
//     success: true,
//   };
// };

module.exports = {
  login,
  signup,
  logout,
  verify,
  // forgot,
  // reset,
};
