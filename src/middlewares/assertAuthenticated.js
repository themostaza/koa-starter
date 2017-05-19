/* @flow */
const assertAuthenticated = async (ctx, next) => {
  if (!ctx.state.currentUser || !ctx.state.currentUser.id || !ctx.state.currentSessionToken) {
    ctx.throw(401);
    return;
  } else {
    await next();
  }
};

module.exports = assertAuthenticated;
