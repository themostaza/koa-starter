/* @flow */
require('dotenv').config();

const app = require('../app');
const constants = require('../config/constants');
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
  await request(app.listen())
    .get(`/public/${constants.PUBLIC_API_KEY}/test`)
    .expect(200)
    .expect('Content-Type', /json/);
});

test('GET /, should return 401 on invalid sessionToken', async () => {
  await request(app.listen())
    .get(`/public/${constants.PUBLIC_API_KEY}/test`)
    .set({ 'X-APP-SESSION-TOKEN': 'invalid' })
    .expect(401);
});
