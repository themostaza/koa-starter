/* @flow */
const DATABASE_URL = process.env.DATABASE_URL;

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
