/* @flow */
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_ENV_DEVELOPMENT = NODE_ENV === 'development';
const IS_ENV_PRODUCTION = NODE_ENV === 'production';
const IS_ENV_TEST = NODE_ENV === 'test';
const PORT = Number.parseInt(process.env.PORT || '3000', 10) || 3000;
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/postgres';

const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || '123456789';
const MANDRILL_API_KEY = process.env.MANDRILL_API_KEY || 'test@test.com';

const HTML_VERIFY_EMAIL_SUCCESS_PATH =
  process.env.HTML_VERIFY_EMAIL_SUCCESS_PATH || './public_html/verify_email_success.html';
const HTML_PASSWORD_UPDATE_REQUEST_PATH =
  process.env.HTML_PASSWORD_UPDATE_REQUEST_PATH || './public_html/password_update_request.html';
const HTML_PASSWORD_UPDATE_SUCCESS_PATH =
  process.env.HTML_PASSWORD_UPDATE_SUCCESS_PATH || './public_html/password_update_success.html';

module.exports = {
  IS_ENV_DEVELOPMENT,
  IS_ENV_PRODUCTION,
  IS_ENV_TEST,
  PORT,
  DATABASE_URL,
  MAIL_FROM_ADDRESS,
  MANDRILL_API_KEY,
  HTML_VERIFY_EMAIL_SUCCESS_PATH,
  HTML_PASSWORD_UPDATE_REQUEST_PATH,
  HTML_PASSWORD_UPDATE_SUCCESS_PATH,
};
