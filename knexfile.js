/* @flow */
require('dotenv').config();
const constants = require('./src/config/constants');
const DATABASE_URL = constants.DATABASE_URL;

module.exports = {
  client: 'postgresql',
  connection: DATABASE_URL,
  migrations: {
    directory: `${__dirname}/src/db/migrations`,
  },
  seeds: {
    directory: `${__dirname}/src/db/seeds`,
  },
  pool: { min: 0, max: 20 },
};
