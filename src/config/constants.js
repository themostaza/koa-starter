/* @flow */
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEVELOPMENT = NODE_ENV === 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const PORT = Number.parseInt(process.env.PORT || '3000', 10) || 3000;
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/my-database';

const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;
const MANDRILL_API_KEY = process.env.MANDRILL_API_KEY;

module.exports = {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  PORT,
  DATABASE_URL,
  MAIL_FROM_ADDRESS,
  MANDRILL_API_KEY,
};
