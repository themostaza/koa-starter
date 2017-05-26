/* @flow */
module.exports = async (ctx, next) => {
  if (!ctx.state.currentUser || !ctx.state.currentUser.id || !ctx.state.currentSessionToken) {
    ctx.throw(401);
    return;
  } else {
    return next();
  }
};
