/* @flow */
const cryptoUtils = require('../utils/crypto');
const knex = require('../db/connection');

const userPlainTextPassword = 'johnson123';

const hash = cryptoUtils.hashPassword(userPlainTextPassword);
const user = {
  id: '932fb35f-623d-44bd-b180-77a71eca5054',
  email: 'jeremy@test.com',
  password: hash,
  verifyEmailToken: 'n283r928j2029jjjflsakdfjasdf03',
  resetPasswordToken: 'jid32soidji201s0n019rdju010dj10',
  resetPasswordTokenExpiresAt: knex.raw(`NOW() + INTERVAL '1 hour'`),
};

const session = {
  id: 'd4c418c9-274b-4a17-9817-fbc14c3e2017',
  token: 'bdade1fd638e8bb4e252bbe8d17c2d63',
  userId: user.id,
  ipAddress: '::ffff:127.0.0.1',
  userAgent: 'node-superagent/3.5.2',
};

const message = {
  id: 'd2b28a21-3da8-47c0-8a27-c14d865f0609',
  text: 'Hello world',
  userId: user.id,
};

module.exports = {
  userPlainTextPassword,
  user,
  session,
  message,
};
