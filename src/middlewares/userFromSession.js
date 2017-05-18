/* @flow */
const knex = require('../db/connection');
const cryptoUtils = require('../utils/crypto');

const userFromSession = async (ctx, next) => {
  const sessionId = ctx.headers['x-app-session-token'];
  if (!sessionId) {
    return next();
  }
  if (!cryptoUtils.isValidUUID(sessionId)) {
    ctx.throw(400, 'Invalid session token');
  }
  const session = await knex('sessions').where({ id: sessionId }).first();
  if (session) {
    ctx.state.currentUserId = session.userId;
    ctx.state.currentSessionId = sessionId;
  }
  await next();
};

module.exports = userFromSession;
