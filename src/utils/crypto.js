/* @flow */
// https://github.com/parse-community/parse-server/blob/master/src/cryptoUtils.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hashPassword = password => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const checkPassword = (password, digest) => {
  return bcrypt.compareSync(password, digest);
};

const createSessionToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

const createVerifyAccountToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

const createResetPasswordToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

module.exports = {
  hashPassword,
  checkPassword,
  createSessionToken,
  createVerifyAccountToken,
  createResetPasswordToken,
};
