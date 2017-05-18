/* @flow */
const knex = require('../db/connection');

const userFromSession = async (ctx, next) => {
  const sessionId = ctx.headers['x-app-session-token'];
  if (!sessionId) {
    return next();
  }
  const session = await knex('sessions').where({ id: sessionId }).first();
  if (session) {
    ctx.currentUserId = session.userId;
    ctx.currentSessionId = sessionId;
  }
  await next();
};

module.exports = userFromSession;
