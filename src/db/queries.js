const _ = require('lodash');
const knex = require('./connection');
const uuid = require('uuid');

const USER_SAFE_MASK = ['id', 'email', 'createdAt'];
exports.maskUser = user => _.pick(user, USER_SAFE_MASK);

exports.getUserBySessionToken = async sessionToken => {
  const sessionQuery = knex
    .select('activeSessions.userId')
    .from('activeSessions')
    .where('activeSessions.token', sessionToken);

  const userQuery = knex.select('users.id').from('users').where('users.id', sessionQuery);

  const updateResult = await knex('users')
    .update('lastOnlineAt', knex.raw(knex.fn.now()))
    .where('id', userQuery)
    .returning(USER_SAFE_MASK);

  return updateResult.length > 0 ? updateResult[0] : null;
};

exports.getUserForLogin = async email => {
  const user = await knex('users').where('email', email).where('emailVerified', true).first();
  return user;
};

exports.isUserEmailAvailable = async email => {
  const user = await knex('users').where('email', email).first();
  return user === null || user === undefined;
};

exports.getUserById = async userId => {
  const user = await knex.first(USER_SAFE_MASK).from('users').where('id', userId);
  return user;
};

exports.createUser = async params => {
  const id = uuid.v4();
  const userParams = Object.assign({}, params, { id });
  const [user] = await knex('users').insert(userParams).returning(USER_SAFE_MASK);
  return user;
};

exports.createSession = async params => {
  const id = uuid.v4();
  const sessionParams = Object.assign({}, params, { id });
  const [session] = await knex('sessions').insert(sessionParams).returning('*');
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
    .where('id', id)
    .where('userId', userId)
    .update({ loggedOutAt: knex.fn.now() });
};

exports.confirmUserEmail = async (email, verifyEmailToken) => {
  const updateResult = await knex('users')
    .where('email', email)
    .where('verifyEmailToken', verifyEmailToken)
    .update({
      emailVerified: true,
      verifyEmailToken: null,
    })
    .returning(USER_SAFE_MASK);
  return updateResult && updateResult.length > 0 ? updateResult[0] : null;
};

exports.updateUserPassword = async (email, resetPasswordToken, password) => {
  const updateResult = await knex('users')
    .where('email', email)
    .where('resetPasswordToken', resetPasswordToken)
    .andWhere('resetPasswordTokenExpiresAt', '>', knex.fn.now())
    .update({
      password: password,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    })
    .returning(USER_SAFE_MASK);
  return updateResult && updateResult.length > 0 ? updateResult[0] : null;
};
