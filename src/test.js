/* @flow */
require('dotenv').config();

const app = require('./app');
const request = require('supertest');
const knex = require('./db/connection');

beforeEach(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();
});

afterEach(async () => {
  await knex.migrate.rollback();
});

afterAll(async () => {
  await knex.destroy();
});

test('GET /, should be reachable', async () => {
  await request(app.listen()).get('/').expect(200).expect('Content-Type', /json/);
});

test('GET /, should return 400 on invalid sessionToken', async () => {
  await request(app.listen()).get('/').set({ 'X-APP-SESSION-TOKEN': 'invalid' }).expect(400);
});

test('POST /auth/signup, should register a new user', async () => {
  const res = await request(app.listen())
    .post('/auth/signup')
    .send({
      email: 'michael@test.com',
      password: 'herman',
    })
    .expect(200);
  expect(res.body.id).toBeTruthy();
  expect(res.body.email).toBe('michael@test.com');
  expect(res.body.createdAt).toBeTruthy();
  expect(res.body.sessionToken).toBeTruthy();
});

test('POST /auth/login, should login an existing user', async () => {
  const res = await request(app.listen())
    .post('/auth/login')
    .send({
      email: 'jeremy@test.com',
      password: 'johnson123',
    })
    .expect(200);
  expect(res.body.id).toBeTruthy();
  expect(res.body.email).toBe('jeremy@test.com');
  expect(res.body.createdAt).toBeTruthy();
  expect(res.body.sessionToken).toBeTruthy();
});

test('POST /auth/logout, should logout a logged in user', async () => {
  const res = await request(app.listen())
    .post('/auth/logout')
    .set({ 'X-APP-SESSION-TOKEN': '932fb35f-623d-44bd-b180-77a71eca5054' })
    .expect(200);
  expect(res.body.success).toBe(true);
});

test('POST /auth/logout, should not logout an unauthenticated user', async () => {
  const res = await request(app.listen())
    .post('/auth/logout')
    .set({ 'X-APP-SESSION-TOKEN': '123e4567-e89b-12d3-a456-426655440000' })
    .expect(401);
});
