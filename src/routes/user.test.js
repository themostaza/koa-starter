require('dotenv').config();
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

/**
 * GET /user
 */
test('GET /user, returns the authenticated user', async () => {
  const res = await request(app.listen())
    .get('/user')
    .set({ 'X-App-Session-Token': mocks.session.token })
    .expect(200);
  expect(res.body.data.id).toBe(mocks.user.id);
  expect(res.body.data.password).toBeFalsy();
});
