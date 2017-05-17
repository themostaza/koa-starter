/* @flow */
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEVELOPMENT = NODE_ENV === 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const PORT = Number.parseInt(process.env.PORT || '3000', 10) || 3000;
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/my-database';

const COOKIE_KEY = process.env.COOKIE_KEY;

if (IS_DEVELOPMENT) {
  console.log(exports);
}

module.exports = {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  PORT,
  DATABASE_URL,
  COOKIE_KEY,
};
