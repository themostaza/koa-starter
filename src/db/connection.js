/* @flow */
const knexFile = require('../../knexfile');

module.exports = require('knex')(knexFile);
