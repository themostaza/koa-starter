/* @flow */
const queries = require('../db/queries');

module.exports = async (ctx, next) => {
  const sessionToken = ctx.headers['x-app-session-token'];
  if (!sessionToken) {
    return next();
  }
  const updatedUser = await queries.getUserBySessionToken(sessionToken);
  if (!updatedUser) {
    ctx.throw(401, 'Session expired, please log-in again');
    return;
  }
  if (updatedUser) {
    ctx.state.currentUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastOnlineAt: updatedUser.lastOnlineAt,
    };
    ctx.state.currentSessionToken = sessionToken;
  }
  return next();
};
