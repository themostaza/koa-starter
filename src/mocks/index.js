/* @flow */
const cryptoUtils = require('../utils/crypto');

const userPlainTextPassword = 'johnson123';

const hash = cryptoUtils.hashPassword(userPlainTextPassword);
const user = {
  id: '932fb35f-623d-44bd-b180-77a71eca5054',
  email: 'jeremy@test.com',
  password: hash,
};

const session = {
  id: '932fb35f-623d-44bd-b180-77a71eca5055',
  token: 'bdade1fd638e8bb4e252bbe8d17c2d63',
  userId: user.id,
  ipAddress: '::ffff:127.0.0.1',
  userAgent: 'node-superagent/3.5.2',
};

module.exports = {
  userPlainTextPassword,
  user,
  session,
};
