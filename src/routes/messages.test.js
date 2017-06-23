require('dotenv').config();
const request = require('supertest');

const app = require('../app');
const mocks = require('../mocks');
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

// ==========================================
//   POST /messages
// ==========================================
test('POST /messages, throws 422 when text is invalid', async () => {
  await request(app.listen())
    .post('/api/v1/messages')
    .set({ 'X-App-Session-Token': mocks.session.token })
    .send({ text: null })
    .expect(422);
});

test('POST /messages, creates a message succesfully', async () => {
  const res = await request(app.listen())
    .post('/api/v1/messages')
    .set({ 'X-App-Session-Token': mocks.session.token })
    .send({ text: 'Hello world!' })
    .expect(200);
  expect(res.body.data.message.text).toBe('Hello world!');
});

// ==========================================
//   DELETE /messages
// ==========================================
test('DELETE /messages, deletes a message successfully', async () => {
  const res = await request(app.listen())
    .delete(`/api/v1/messages/${mocks.message.id}`)
    .set({ 'X-App-Session-Token': mocks.session.token })
    .expect(200);
  expect(res.body.data.success).toBe(true);
});

// ==========================================
//   GET /messages
// ==========================================
test('GET /messages, gets all the messages', async () => {
  const res = await request(app.listen())
    .get('/api/v1/messages')
    .set({ 'X-App-Session-Token': mocks.session.token })
    .expect(200);
  expect(res.body.data.messages.length).toBe(1);
  expect(res.body.data.messages[0].id).toEqual(mocks.message.id);
  expect(res.body.data.messages[0].text).toEqual(mocks.message.text);
});
