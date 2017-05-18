// /* @flow */
// const bcrypt = require('bcrypt');
// const LocalStrategy = require('passport-local');
// const koaPassport = require('koa-passport');
// const knex = require('./db/connection');

// const comparePass = (userPassword, databasePassword) => {
//   return bcrypt.compareSync(userPassword, databasePassword);
// };

// koaPassport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// koaPassport.deserializeUser(async (id, done) => {
//   try {
//     const user = await knex('users');
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// const localStrategyOptions = { usernameField: 'email', passwordField: 'password' };
// const localStrategyFunction = (email, password, done) => {
//   return knex('users')
//     .where({ email })
//     .first()
//     .then(user => {
//       if (!user) return done(null, false);
//       if (comparePass(password, user.password)) {
//         done(null, user);
//       } else {
//         done(null, false);
//       }
//     })
//     .catch(err => done(err));
// };

// koaPassport.use(new LocalStrategy(localStrategyOptions, localStrategyFunction));

// module.exports = koaPassport;
