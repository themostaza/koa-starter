/* @flow */
const queries = require('../db/queries');

// ==========================================
//   POST /messages
// ==========================================
exports.createMessage = async ctx => {
  ctx.validateBody('text').required().isString().trim();
  const { text } = ctx.vals;
  const { user } = ctx.state;
  const message = await queries.createMessage(text, user.id);
  ctx.body = {
    data: { message: message },
  };
};

// ==========================================
//   DELETE /messages
// ==========================================
exports.deleteMessage = async ctx => {
  ctx.validateParam('id').required().isString();
  const { id } = ctx.vals;
  const { user } = ctx.state;
  const numOfDeletedMessages = await queries.deleteMessageById(id, user.id);
  if (numOfDeletedMessages === 0) {
    ctx.throw(404, 'Message non found');
  }
  ctx.body = {
    data: { success: true },
  };
};

// ==========================================
//   GET /messages
// ==========================================
exports.getAllMessages = async ctx => {
  const messages = await queries.getAllMessages();
  ctx.body = {
    data: {
      messages: messages,
    },
  };
};
