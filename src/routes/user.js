const _ = require('lodash');
const queries = require('../db/queries');

/**
 * GET /user
 * 
 * Gets the authenticated user.
 * @return The authenticated user.
 */
exports.getUser = async ctx => {
  const { user } = ctx.state;
  if (!user) {
    ctx.throw(404, 'User not found.');
  }
  ctx.body = { data: queries.maskUser(user) };
};
