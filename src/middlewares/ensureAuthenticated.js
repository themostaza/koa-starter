/* @flow */
const queries = require('../db/queries');

module.exports = async (ctx, next) => {
  const sessionToken = ctx.headers['x-app-session-token'] || ctx.headers['X-App-Session-Token'];
  if (!sessionToken) {
    ctx.throw(401, 'Missing session token');
    return;
  }
  const updatedUser = await queries.getUserBySessionToken(sessionToken);
  if (!updatedUser) {
    ctx.throw(401, 'Session expired, please log-in again');
    return;
  } else {
    ctx.state.user = updatedUser;
    ctx.state.sessionToken = sessionToken;
    return next();
  }
};
