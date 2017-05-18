/* @flow */
const bcrypt = require('bcrypt');

exports.seed = async knex => {
  // User
  await knex('users').del();
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync('johnson123', salt);
  const [user] = await knex('users')
    .insert({
      email: 'jeremy@test.com',
      password: hash,
    })
    .returning('*');
  // Session
  await knex('sessions').del();
  await knex('sessions').insert({
    id: '932fb35f-623d-44bd-b180-77a71eca5054',
    userId: user.id,
    ipAddress: '::ffff:127.0.0.1',
    userAgent: 'node-superagent/3.5.2',
    loggedOutAt: null,
    createdAt: knex.raw(`now()`),
  });
};
