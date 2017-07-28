const _ = require('lodash');
const queries = require('../db/queries');

const withoutUndefined = obj => _.omitBy(obj, _.isUndefined);

/**
 * GET /messages
 * 
 * Gets all the messages.
 * @param {String} query.userId The userId of the searched messages.
 * @return {Message[]} The list of found messages.
 */
exports.getMessages = async ctx => {
  ctx.validateQuery('userId').optional().isString();
  const { userId } = ctx.vals;
  const queryParams = withoutUndefined({ userId });
  const messages = await queries.getMessages(queryParams);
  ctx.body = { data: messages };
};

/**
 * GET /messages/:id
 * 
 * Gets all the messages.
 * @param {String} param.id The id of the searched message.
 * @return {Message} The found message.
 */
exports.getMessage = async ctx => {
  ctx.validateParam('id').required().isString();
  const { id } = ctx.vals;
  const message = await queries.getMessageById(id);
  ctx.body = { data: message };
};

/**
 * POST /messages/
 * 
 * Creates a new message.
 * @param {String} body.text The text of the message.
 * @return {Message} The created message.
 */
exports.createMessage = async ctx => {
  ctx.validateBody('text').required().isString();
  const { text } = ctx.vals;
  const userId = ctx.state.user.id;
  const messageParams = { text, userId };
  const message = await queries.createMessage(messageParams);
  ctx.body = { data: message };
};

/**
 * PATCH /messages/:id
 * 
 * Updates an existing message.
 * @param {String} param.id The id of the message.
 * @param {String} body.text The new text of the message.
 * @return {Message} The updated message.
 */
exports.updateMessage = async ctx => {
  ctx.validateParam('id').required().isString();
  ctx.validateBody('text').required().isString();
  const { id, text } = ctx.vals;
  const userId = ctx.state.user.id;
  if (!await queries.isMessageEditable(id, userId)) {
    ctx.throw(401, 'Insufficient permissions');
  }
  const messageParams = { text };
  const message = await queries.updateMessage(id, messageParams);
  ctx.body = { data: message };
};

/**
 * DELETE /messages/:id
 * 
 * Updates an existing message.
 * @param {String} param.id The id of the message.
 * @return {Message} The deleted message.
 */
exports.deleteMessage = async ctx => {
  ctx.validateParam('id').required().isString();
  const { id } = ctx.vals;
  const userId = ctx.state.user.id;
  if (!await queries.isMessageEditable(id, userId)) {
    ctx.throw(401, 'Insufficient permissions');
  }
  const message = await queries.deleteMessage(id);
  ctx.body = { data: message };
};
