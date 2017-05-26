/* @flow */
const queries = require('../db/queries');

exports.createMessage = async ctx => {
  if (!ctx.request.body) {
    ctx.throw(400, 'Invalid request body');
  }
  if (!ctx.request.body.text) {
    ctx.throw(400, 'Required field: text');
  }
  const message = await queries.createMessage(ctx.request.body.text, ctx.state.currentUser.id);
  ctx.body = {
    message: message,
  };
};

exports.deleteMessage = async ctx => {
  if (!ctx.request.body) {
    ctx.throw(400, 'Invalid request body');
  }
  const numOfDeletedMessages = await queries.deleteMessageById(
    ctx.params.id,
    ctx.state.currentUser.id,
  );

  if (numOfDeletedMessages === 0) {
    ctx.throw(404, 'Message non found');
  }

  ctx.body = {
    success: true,
  };
};

exports.getAllMessages = async ctx => {
  const messages = await queries.getAllMessages();
  ctx.body = messages;
};
