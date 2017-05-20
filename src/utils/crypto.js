/* @flow */
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

const isValidUUID = uuid => {
  const re = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  return re.test(uuid);
};

// https://github.com/parse-community/parse-server/blob/master/src/cryptoUtils.js
const createSessionToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

const createVerifyAccountToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

const createResetPasswordToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

const createTemporaryPassword = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

module.exports = {
  hashPassword,
  checkPassword,
  isValidUUID,
  createSessionToken,
  createVerifyAccountToken,
  createResetPasswordToken,
  createTemporaryPassword,
};
