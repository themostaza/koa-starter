/* @flow */
const send = require('koa-send');
const validator = require('validator');
const cryptoUtils = require('../utils/crypto');
const constants = require('../config/constants');
const mandrillService = require('../services/mandrill');
const queries = require('../db/queries');

// ========================
//   AUTH/SIGNUP
// ========================
exports.signup = async ctx => {
  ctx.validateBody('email').required().isEmail().trim();
  ctx.validateBody('password').required().isLength(8, 32, 'Password must be 8-32 chars');
  const { email, password } = ctx.vals;
  const isEmailAlreadyAvailable = await queries.isUserEmailAvailable(email);
  if (!isEmailAlreadyAvailable) {
    ctx.throw(409, 'Email already in use');
  }
  const hash = cryptoUtils.hashPassword(password);
  await queries.createUser(email, hash);
  const token = cryptoUtils.createVerifyAccountToken();
  // TODO: Update this string with a BASE_URL maybe?
  const url = `http://${ctx.headers.host}api/v1/auth/verify?token=${token}&email=${email}`;
  await mandrillService.sendVerifyAccountEmail(email, url);
  ctx.body = { success: true };
};

// ========================
//   AUTH/LOGIN
// ========================
exports.login = async ctx => {
  ctx.validateBody('email').required().isString().trim();
  ctx.validateBody('password').required().isString();
  const { email, password } = ctx.vals;
  const user = await queries.getUserByEmail(email);
  if (!user || !cryptoUtils.checkPassword(password, user.password)) {
    ctx.throw(401, 'Invalid credentials');
  }
  const token = cryptoUtils.createSessionToken();
  const session = await queries.createSession(token, user.id, ctx.ip, ctx.headers['user-agent']);
  ctx.body = {
    user: {
      id: user.id,
      email: user.email,
    },
    sessionToken: session.id,
  };
};

// ========================
//   AUTH/LOGOUT
// ========================
exports.logout = async ctx => {
  const { currentSessionToken, currentUser } = ctx.state;
  await queries.logoutSession(currentSessionToken, currentUser.id);
  ctx.body = { success: true };
};

// ========================
//   AUTH/VERIFY
// ========================
exports.verify = async ctx => {
  ctx.validateQuery('token').required().isString();
  ctx.validateQuery('email').required().isString().trim();
  const { token, email } = ctx.vals;
  const updatedUser = await queries.confirmUserEmail(email, token);
  if (!updatedUser) {
    ctx.throw(422, 'Invalid url');
  }
  await send(ctx, constants.HTML_VERIFY_EMAIL_SUCCESS_PATH);
};

// ========================
//   AUTH/FORGOT
// ========================
exports.forgot = async ctx => {
  ctx.validateBody('email').required().isEmail().trim();
  const { email } = ctx.vals;
  const token = cryptoUtils.createResetPasswordToken();
  const updatedUser = await queries.setUserResetPasswordToken(email, token);
  if (!updatedUser) {
    ctx.throw(404, 'User not found.');
  }
  // TODO: Update this string with a BASE_URL maybe?
  const url = `http://${ctx.headers.host}api/v1/auth/reset?token=${token}&email=${email}`;
  await mandrillService.sendPasswordResetEmail(email, url);
  ctx.body = {
    success: true,
  };
};

// ========================
//   AUTH/SHOW_RESET_PAGE
// ========================
exports.showResetPage = async ctx => {
  ctx.validateQuery('token').required().isString();
  ctx.validateQuery('email').required().isString().trim();
  return await send(ctx, `${constants.HTML_PASSWORD_UPDATE_REQUEST_PATH}`);
};

// ========================
//   AUTH/RESET
// ========================
exports.reset = async ctx => {
  if (!ctx.request.body || !ctx.request.body.token || !ctx.request.body.email) {
    ctx.throw(422, 'Password reset token is invalid or has expired.');
  }
  const token = ctx.request.body.token;
  const email = ctx.request.body.email.trim();
  const redirectBaseUrl = `http://${ctx.headers.host}/api/v1/auth/reset?token=${token}&email=${email}`;
  if (!ctx.request.body.password) {
    const error = 'Required field: password';
    ctx.redirect(`${redirectBaseUrl}&error=${error}`);
    return;
  }
  if (!validator.isLength(ctx.request.body.password, { min: 8, max: 32 })) {
    const error = 'Password lenght must be between 8 and 32 characters';
    ctx.redirect(`${redirectBaseUrl}&error=${error}`);
    return;
  }
  const password = ctx.request.body.password;
  const hash = cryptoUtils.hashPassword(password);
  const updatedUser = await queries.updateUserPassword(email, token, hash);
  if (!updatedUser) {
    const error = 'Password reset token is invalid or has expired.';
    ctx.redirect(`${redirectBaseUrl}&error=${error}`);
    return;
  }
  return await send(ctx, `${constants.HTML_PASSWORD_UPDATE_SUCCESS_PATH}`);
};
