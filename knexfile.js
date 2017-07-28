require('dotenv').config();
const keys = require('./src/config/keys');
const DATABASE_URL = keys.DATABASE_URL;

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
