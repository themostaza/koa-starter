const uuid = require('uuid');
const cryptoUtils = require('../../utils/crypto');
const knex = require('../connection');

exports.userPlainTextPassword = 'johnson123';
exports.user = {
  id: uuid.v4(),
  email: 'jeremy@test.com',
  password: cryptoUtils.hashPassword(exports.userPlainTextPassword),
  emailVerified: true,
  verifyEmailToken: cryptoUtils.createVerifyAccountToken(),
  resetPasswordToken: cryptoUtils.createResetPasswordToken(),
  resetPasswordTokenExpiresAt: knex.raw(`NOW() + INTERVAL '1 hour'`),
};

exports.session = {
  id: uuid.v4(),
  token: 'bdade1fd638e8bb4e252bbe8d17c2d63',
  userId: exports.user.id,
  ipAddress: '::ffff:127.0.0.1',
  userAgent: 'node-superagent/3.5.2',
};

exports.message = {
  id: uuid.v4(),
  userId: exports.user.id,
  text: 'Hello world',
};

exports.seed = async knex => {
  await knex('messages').del();
  await knex('sessions').del();
  await knex('users').del();
  await knex('users').insert(Object.assign({}, exports.user));
  await knex('sessions').insert(Object.assign({}, exports.session));
  await knex('messages').insert(Object.assign({}, exports.message));
};
