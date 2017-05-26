/* @flow */
require('dotenv').config();

const app = require('../app');
const mocks = require('../mocks');
const request = require('supertest');
const knex = require('../db/connection');

beforeEach(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();
  jest.clearAllMocks();
});

afterEach(async () => {
  await knex.migrate.rollback();
});

afterAll(async () => {
  await knex.destroy();
});

// ========================
//   MESSAGES/CREATE
// ========================
test('POST /messages, throws 400 when text is invalid', async () => {
  const res = await request(app.listen())
    .post('/messages')
    .set({ 'X-APP-SESSION-TOKEN': mocks.session.token })
    .send({ text: null })
    .expect(400);
  expect(res.body).toEqual({});
});

test('POST /messages, creates a message succesfully', async () => {
  const res = await request(app.listen())
    .post('/messages')
    .set({ 'X-APP-SESSION-TOKEN': mocks.session.token })
    .send({ text: 'Hello world!' })
    .expect(200);
  expect(res.body.message.text).toBe('Hello world!');
});

// ========================
//   MESSAGES/DELETE
// ========================
test('DELETE /messages, deletes a message successfully', async () => {
  const res = await request(app.listen())
    .delete(`/messages/${mocks.message.id}`)
    .set({ 'X-APP-SESSION-TOKEN': mocks.session.token })
    .expect(200);
  expect(res.body.success).toBe(true);
});

// ========================
//   MESSAGES/GET
// ========================
test('GET /messages, gets all the messages', async () => {
  const res = await request(app.listen())
    .get('/messages')
    .set({ 'X-APP-SESSION-TOKEN': mocks.session.token })
    .expect(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].id).toEqual(mocks.message.id);
  expect(res.body[0].text).toEqual(mocks.message.text);
});
