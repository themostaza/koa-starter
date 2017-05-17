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

afterEach(() => {
  return knex.migrate.rollback();
});

test('GET /, should be reachable', async () => {
  await request(app.listen()).get('/').expect(200);
});

test('POST /auth/signup, should register a new user', async () => {
  const res = await request(app.listen())
    .post('/auth/signup')
    .send({
      email: 'michael@test.com',
      password: 'herman',
    })
    .expect(200)
    .expect('Content-Type', /json/);
  expect(res.body.user.email).toBe('michael@test.com');
  expect(res.body.user.admin).toBe(false);
});

test('POST /auth/login, should login an existing user', async () => {
  const res = await request(app.listen())
    .post('/auth/login')
    .send({
      email: 'jeremy@test.com',
      password: 'johnson123',
    })
    .expect(200)
    .expect('Content-Type', /json/);
  expect(res.body.user.email).toBe('jeremy@test.com');
  expect(res.body.user.admin).toBe(false);
});
