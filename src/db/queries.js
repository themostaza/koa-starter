/* @flow */
const knex = require('./connection');
const uuid = require('uuid');

// TODO: Translate to knex query languague
// TODO: Is updating "lastOnlineAt" needed at all?
exports.getUserBySessionToken = async sessionToken => {
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
  return updateResult.rows.length > 0 ? updateResult.rows[0] : null;
};

exports.getUserByEmail = async email => {
  const user = await knex('users').where({ email }).first();
  return user;
};

exports.isUserEmailAvailable = async email => {
  const user = await exports.getUserByEmail(email);
  return user === null || user === undefined;
};

exports.createUser = async (email, password) => {
  const [user] = await knex('users')
    .insert({ id: uuid.v4(), email: email, password: password })
    .returning('*');
  return user;
};

exports.createSession = async (token, userId, ipAddress, userAgent) => {
  const [session] = await knex('sessions')
    .insert({
      id: uuid.v4(),
      token: token,
      userId: userId,
      ipAddress: ipAddress,
      userAgent: userAgent,
    })
    .returning('*');
  return session;
};

exports.setUserResetPasswordToken = async (email, token) => {
  const updatedUser = await knex('users').where({ email }).update({
    resetPasswordToken: token,
    resetPasswordTokenExpiresAt: knex.raw(`NOW() + INTERVAL '1 hour'`),
  });
  return updatedUser;
};

exports.logoutSession = async (id, userId) => {
  await knex('sessions')
    .where({ id: id, userId: userId })
    .update({ loggedOutAt: knex.raw(`now()`) });
};

exports.confirmUserEmail = async (email, verifyEmailToken) => {
  const updateResult = await knex('users')
    .where({ email: email, verifyEmailToken: verifyEmailToken })
    .update({
      emailVerified: true,
      verifyEmailToken: null,
    })
    .returning('*');
  return updateResult && updateResult.length > 0 ? updateResult[0] : null;
};

exports.updateUserPassword = async (email, resetPasswordToken, password) => {
  const updatedUser = await knex('users')
    .where({ email: email, resetPasswordToken: resetPasswordToken })
    .andWhere('resetPasswordTokenExpiresAt', '>', knex.raw(`now()`))
    .update({
      password: password,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    });
  return updatedUser;
};

exports.createMessage = async (text, userId) => {
  const [message] = await knex('messages')
    .insert({ id: uuid.v4(), text: text, userId: userId })
    .returning('*');
  return message;
};

exports.deleteMessageById = async (id, userId) => {
  const numOfDeletedMessages = await knex('messages').where({ id: id, userId: userId }).del();
  return numOfDeletedMessages;
};

exports.getRecentMessages = async () => {
  const messages = await knex('messages').orderBy('createdAt', 'DESC').limit(25).returning('*');
  return messages;
};

exports.getAllMessages = async () => {
  const messages = await knex('messages').orderBy('createdAt', 'DESC').returning('*');
  return messages;
};
