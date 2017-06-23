// https://github.com/parse-community/parse-server/blob/master/src/cryptoUtils.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.hashPassword = password => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

exports.checkPassword = (password, digest) => {
  return bcrypt.compareSync(password, digest);
};

exports.createSessionToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

exports.createVerifyAccountToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};

exports.createResetPasswordToken = () => {
  return crypto.randomBytes(32 / 2).toString('hex');
};
