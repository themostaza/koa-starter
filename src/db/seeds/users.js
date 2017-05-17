/* @flow */
const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) => {
  return knex('users')
    .del()
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('johnson123', salt);
      return Promise.join(
        knex('users').insert({
          email: 'jeremy@test.com',
          password: hash,
        })
      );
    })
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('bryant123', salt);
      return Promise.join(
        knex('users').insert({
          email: 'kelly@test.com',
          password: hash,
          admin: true,
        })
      );
    });
};
