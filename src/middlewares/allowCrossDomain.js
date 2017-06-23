// https://github.com/parse-community/parse-server/blob/master/src/middlewares.js

module.exports = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'X-App-Session-Token, Content-Type');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
    return;
  }
  return next();
};
