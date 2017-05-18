/* @flow */
const bcrypt = require('bcrypt');

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

module.exports = {
  hashPassword,
  checkPassword,
  isValidUUID,
};
