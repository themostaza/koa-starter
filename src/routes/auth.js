const send = require('koa-send');
const validator = require('validator');
const cryptoUtils = require('../utils/crypto');
const constants = require('../config/constants');
const mandrillService = require('../services/mandrill');
const queries = require('../db/queries');

/**
 * POST /auth/signup
 * 
 * Creates an user in the db and sends a verification email to its email address.
 * @param {String} body.email The email of the user.
 * @param {String} body.password The password of the user.
 * @return {Object} An empty object in case of success.
 */
exports.signup = async ctx => {
  ctx.validateBody('email').required().isEmail().trim().tap(x => x.toLowerCase());
  ctx.validateBody('password').required().isLength(8, 32, 'Password must be 8-32 chars');
  const { email, password } = ctx.vals;
  const isEmailAlreadyAvailable = await queries.isUserEmailAvailable(email);
  if (!isEmailAlreadyAvailable) {
    ctx.throw(409, 'Email already in use');
  }
  const hash = cryptoUtils.hashPassword(password);
  const verifyEmailToken = cryptoUtils.createVerifyAccountToken();
  await queries.createUser({ email, password: hash, verifyEmailToken });
  const url = `http://${ctx.headers.host}/auth/verify?token=${verifyEmailToken}&email=${email}`;
  await mandrillService.sendVerifyAccountEmail(email, url);
  ctx.body = { data: {} };
};

/**
 * POST /auth/login
 * 
 * Create a session in the db for the user.
 * @param {String} body.email The email of the user.
 * @param {String} body.password The password of the user.
 * @return {Object} An object with `user` and `sessionToken`.
 */
exports.login = async ctx => {
  ctx.validateBody('email').required().isString().trim().tap(x => x.toLowerCase());
  ctx.validateBody('password').required().isString();
  const { email, password } = ctx.vals;
  const user = await queries.getUserForLogin(email);
  if (!user || !cryptoUtils.checkPassword(password, user.password)) {
    ctx.throw(401, 'Invalid credentials');
  }
  const token = cryptoUtils.createSessionToken();
  await queries.createSession({
    token,
    userId: user.id,
    ipAddress: ctx.ip,
    userAgent: ctx.headers['user-agent'],
  });
  ctx.body = {
    data: {
      user: queries.maskUser(user),
      sessionToken: token,
    },
  };
};

/**
 * POST /auth/logout
 * 
 * Sets `loggedOutAt` on the authenticated user session in the db.
 * @return {Object} An empty object in case of success.
 */
exports.logout = async ctx => {
  const { sessionToken, user } = ctx.state;
  await queries.logoutSession(sessionToken, user.id);
  ctx.body = { data: {} };
};

/**
 * GET /auth/verify
 * 
 * Sets `emailVerified` to true on an user.
 * @param {String} query.token The email verification token of the user.
 * @param {String} query.email The email of the user.
 * @redirect Redirect the user to an HTML page with a success message.
 */
exports.verify = async ctx => {
  ctx.validateQuery('token').required().isString();
  ctx.validateQuery('email').required().isString().trim().tap(x => x.toLowerCase());
  const { token, email } = ctx.vals;
  const updatedUser = await queries.confirmUserEmail(email, token);
  if (!updatedUser) {
    ctx.throw(422, 'Invalid url');
  }
  await send(ctx, constants.HTML_VERIFY_EMAIL_SUCCESS_PATH);
};

/**
 * POST /auth/forgot
 * 
 * Sets a new `resetPassowrdToken` to an user and sends a password reset link to his email address.
 * @param {String} body.email The email of the user.
 * @return {Object} An empty object in case of success.
 */
exports.forgot = async ctx => {
  ctx.validateBody('email').required().isEmail().trim().tap(x => x.toLowerCase());
  const { email } = ctx.vals;
  const token = cryptoUtils.createResetPasswordToken();
  const updatedUser = await queries.setUserResetPasswordToken(email, token);
  if (!updatedUser) {
    ctx.throw(404, 'User not found.');
  }
  const url = `http://${ctx.headers.host}/auth/reset?token=${token}&email=${email}`;
  await mandrillService.sendPasswordResetEmail(email, url);
  ctx.body = { data: {} };
};

/**
 * GET /auth/reset
 * 
 * Sets `emailVerified` to true on an user.
 * @param {String} query.token The password reset token of the user.
 * @param {String} query.email The email of the user.
 * @redirect Redirect the user to an HTML page where he can change his password.
 */
exports.showResetPage = async ctx => {
  ctx.validateQuery('token').required().isString();
  ctx.validateQuery('email').required().isString().trim().tap(x => x.toLowerCase());
  return await send(ctx, `${constants.HTML_PASSWORD_UPDATE_REQUEST_PATH}`);
};

/**
 * POST /auth/reset
 * 
 * Sets `emailVerified` to true on an user.
 * @param {String} query.token The password reset token of the user.
 * @param {String} query.email The email of the user.
 * @param {String} query.password The new password of the user.
 * @redirect Redirect the user to an HTML page with a success message if the new password is valid,
 *           failure message otherwise.
 */
exports.reset = async ctx => {
  ctx.validateBody('token').required('Password reset token is invalid or has expired.');
  ctx
    .validateBody('email')
    .required('Password reset token is invalid or has expired.')
    .trim()
    .tap(x => x.toLowerCase());
  const { token, email } = ctx.vals;
  const redirectBaseUrl = `http://${ctx.headers.host}/auth/reset?token=${token}&email=${email}`;
  if (!ctx.request.body.password) {
    const error = 'Required field: password';
    ctx.redirect(`${redirectBaseUrl}&error=${error}`);
    return;
  }
  const password = ctx.request.body.password;
  if (!validator.isLength(password, { min: 8, max: 32 })) {
    const error = 'Password lenght must be between 8 and 32 characters';
    ctx.redirect(`${redirectBaseUrl}&error=${error}`);
    return;
  }
  const hash = cryptoUtils.hashPassword(password);
  const updatedUser = await queries.updateUserPassword(email, token, hash);
  if (!updatedUser) {
    const error = 'Password reset token is invalid or has expired.';
    ctx.redirect(`${redirectBaseUrl}&error=${error}`);
    return;
  }
  return await send(ctx, `${constants.HTML_PASSWORD_UPDATE_SUCCESS_PATH}`);
};
