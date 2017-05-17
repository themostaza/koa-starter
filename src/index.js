/* @flow */
require('dotenv').config();
const constants = require('./config/constants');
const app = require('./app');

app.listen(constants.PORT, () => {
  console.log('Listening on port ', constants.PORT);
});

module.exports = app;
