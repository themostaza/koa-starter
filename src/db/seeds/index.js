const cryptoUtils = require('../../utils/crypto');
const knex = require('../connection');

exports.userPlainTextPassword = 'johnson123';
exports.user = {
  id: '932fb35f-623d-44bd-b180-77a71eca5054',
  email: 'jeremy@test.com',
  password: cryptoUtils.hashPassword(exports.userPlainTextPassword),
  emailVerified: true,
  verifyEmailToken: 'n283r928j2029jjjflsakdfjasdf03',
  resetPasswordToken: 'jid32soidji201s0n019rdju010dj10',
  resetPasswordTokenExpiresAt: knex.raw(`NOW() + INTERVAL '1 hour'`),
};

exports.session = {
  id: 'd4c418c9-274b-4a17-9817-fbc14c3e2017',
  token: 'bdade1fd638e8bb4e252bbe8d17c2d63',
  userId: exports.user.id,
  ipAddress: '::ffff:127.0.0.1',
  userAgent: 'node-superagent/3.5.2',
};

exports.seed = async knex => {
  await knex('users').del();
  await knex('users').insert(Object.assign({}, exports.user));
  await knex('sessions').del();
  await knex('sessions').insert(Object.assign({}, exports.session));
};
