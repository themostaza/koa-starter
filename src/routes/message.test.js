require('dotenv').config();
const uuid = require('uuid');
const request = require('supertest');
const app = require('../app');
const mocks = require('../db/seeds');
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
//   GET /messages
// ==========================================
test('GET /messages, returns all the messages user', async () => {
  const res = await request(app.listen()).get('/messages').expect(200);
  expect(res.body.data[0].id).toBe(mocks.message.id);
});

// ==========================================
//   GET /messages/:id
// ==========================================
test('GET /messages/:id, returns null when the user is not found', async () => {
  const res = await request(app.listen()).get(`/messages/${uuid.v4()}`).expect(200);
  expect(res.body.data).toBeFalsy();
});

test('POST /auth/signup, returns the searched message', async () => {
  const res = await request(app.listen()).get(`/messages/${mocks.message.id}`).expect(200);
  expect(res.body.data.id).toBe(mocks.message.id);
});

// ==========================================
//   POST /messages
// ==========================================
test('POST /messages, creates a message successfully', async () => {
  const res = await request(app.listen())
    .post('/messages')
    .set({ 'X-App-Session-Token': mocks.session.token })
    .send({ text: 'Hey!' })
    .expect(200);
  expect(res.body.data.text).toBe('Hey!');
});

// ==========================================
//   PATCH /messages/:id
// ==========================================
test('PATCH /messages/:id, updates a message successfully', async () => {
  const res = await request(app.listen())
    .patch(`/messages/${mocks.message.id}`)
    .set({ 'X-App-Session-Token': mocks.session.token })
    .send({ text: 'Hello world updated' })
    .expect(200);
  expect(res.body.data.text).toBe('Hello world updated');
});

// ==========================================
//   DELETE /messages/:id
// ==========================================
test('DELETE /messages/:id, deletes a message successfully', async () => {
  const res = await request(app.listen())
    .delete(`/messages/${mocks.message.id}`)
    .set({ 'X-App-Session-Token': mocks.session.token })
    .expect(200);
  expect(res.body.data.id).toBe(mocks.message.id);
});
