/* @flow */
const assertAuthenticated = async (ctx, next) => {
  if (!ctx.state.currentUserId || !ctx.state.currentSessionId) {
    ctx.throw(401);
  } else {
    await next();
  }
};

module.exports = assertAuthenticated;
