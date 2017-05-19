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

test('GET /, should return 401 on invalid sessionToken', async () => {
  await request(app.listen()).get('/').set({ 'X-APP-SESSION-TOKEN': 'invalid' }).expect(401);
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
      email: mocks.user.email,
      password: mocks.userPlainTextPassword,
    })
    .expect(200);
  expect(res.body.id).toBeTruthy();
  expect(res.body.email).toBe(mocks.user.email);
  expect(res.body.createdAt).toBeTruthy();
  expect(res.body.sessionToken).toBeTruthy();
});

test('POST /auth/logout, should logout a logged in user', async () => {
  const res = await request(app.listen())
    .post('/auth/logout')
    .set({ 'X-APP-SESSION-TOKEN': mocks.session.token })
    .expect(200);
  expect(res.body.success).toBe(true);
});

test('POST /auth/logout, should not logout an unauthenticated user', async () => {
  const res = await request(app.listen())
    .post('/auth/logout')
    .set({ 'X-APP-SESSION-TOKEN': '123e4567-e89b-12d3-a456-426655440000' })
    .expect(401);
});