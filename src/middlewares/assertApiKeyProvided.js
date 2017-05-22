/* @flow */
const constants = require('../config/constants');

const assertApiKeyProvided = async (ctx, next) => {
  const urlParams = ctx.params || {};
  const apiKey = ctx.request.headers['x-app-public-api-key'] || urlParams.publicApiKey;
  if (!apiKey || apiKey !== constants.PUBLIC_API_KEY) {
    ctx.throw(401);
    return;
  } else {
    await next();
  }
};

module.exports = assertApiKeyProvided;
