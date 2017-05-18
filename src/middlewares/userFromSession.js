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
    return;
  }
  // TODO: Translate to knex query languague
  // TODO: Is updating "lastOnlineAt" needed at all?
  const updateResult = await knex.raw(
    `
    UPDATE users
    SET "lastOnlineAt" = NOW()
    WHERE id = (
      SELECT u.id
      FROM users u
      WHERE u.id = (
        SELECT s."userId"
        FROM "activeSessions" s
        WHERE s.id = '${sessionId}'
      )
    )
    RETURNING *
  `
  );
  const updatedUser = updateResult.rows[0];
  if (!updatedUser || !updatedUser.id) {
    ctx.throw(401, 'Session expired, please log-in again');
    return;
  }
  if (updatedUser && updatedUser.id) {
    ctx.state.currentUserId = updatedUser.id;
    ctx.state.currentSessionId = sessionId;
  }
  await next();
};

module.exports = userFromSession;
