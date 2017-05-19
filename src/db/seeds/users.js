/* @flow */
const mocks = require('../../mocks');

exports.seed = async knex => {
  // User
  await knex('users').del();
  const user = Object.assign({}, mocks.user);
  await knex('users').insert(user).returning('*');
  // Session
  await knex('sessions').del();
  const session = Object.assign({}, mocks.session);
  session.createdAt = knex.raw(`now()`);
  await knex('sessions').insert(session);
};
