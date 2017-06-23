require('dotenv').config();

const app = require('../app');
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
