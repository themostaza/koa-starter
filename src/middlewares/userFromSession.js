/* @flow */
const knex = require('../db/connection');

const userFromSession = async (ctx, next) => {
  const sessionToken = ctx.headers['x-app-session-token'];
  if (!sessionToken) {
    return next();
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
        WHERE s.token = '${sessionToken}'
      )
    )
    RETURNING *
  `
  );
  const updatedUser = updateResult.rows[0];
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
  await next();
};

module.exports = userFromSession;
