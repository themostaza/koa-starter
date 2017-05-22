/* @flow */
require('dotenv').config();

const app = require('../../app');
const mocks = require('../../mocks');
const request = require('supertest');
const knex = require('../../db/connection');
jest.mock('../../services/mandrill.js');

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
//   AUTH/SIGNUP
// ========================
test('POST /auth/signup, throws 400 when email is invalid', async () => {
  const res = await request(app.listen())
    .post('/auth/signup')
    .send({ email: 'michaeltest.com', password: 'herman123' })
    .expect(400);
  expect(res.body).toEqual({});
});

test('POST /auth/signup, throws 400 when password is invalid', async () => {
  const res = await request(app.listen())
    .post('/auth/signup')
    .send({ email: 'michael@test.com', password: 'herman' })
    .expect(400);
  expect(res.body).toEqual({});
});

test('POST /auth/signup, throws 409 when email is already in use', async () => {
  const res = await request(app.listen())
    .post('/auth/signup')
    .send({ email: mocks.user.email, password: 'herman123' })
    .expect(409);
  expect(res.body).toEqual({});
});

test('POST /auth/signup, should register a new user', async () => {
  const mandrillService = require('../../services/mandrill');
  const res = await request(app.listen())
    .post('/auth/signup')
    .send({ email: 'michael@test.com', password: 'herman123' })
    .expect(200);
  expect(res.body.success).toBe(true);
  expect(mandrillService.sendVerifyAccountEmail).toHaveBeenCalledTimes(1);
});

// ========================
//   AUTH/LOGIN
// ========================
test('POST /auth/login, throws 400 when email is empty', async () => {
  const res = await request(app.listen())
    .post('/auth/login')
    .send({ password: 'herman123' })
    .expect(400);
  expect(res.body).toEqual({});
});

test('POST /auth/login, throws 400 when password is empty', async () => {
  const res = await request(app.listen())
    .post('/auth/login')
    .send({ email: mocks.user.email })
    .expect(400);
  expect(res.body).toEqual({});
});

test('POST /auth/login, throws 401 when credentials are invalid', async () => {
  const res = await request(app.listen())
    .post('/auth/login')
    .send({ email: mocks.user.email, password: 'asdfasdf' })
    .expect(401);
  expect(res.body).toEqual({});
});

test('POST /auth/login, logins an existing user', async () => {
  const res = await request(app.listen())
    .post('/auth/login')
    .send({ email: mocks.user.email, password: mocks.userPlainTextPassword })
    .expect(200);
  expect(res.body.id).toBeTruthy();
  expect(res.body.email).toBe(mocks.user.email);
  expect(res.body.createdAt).toBeTruthy();
  expect(res.body.sessionToken).toBeTruthy();
});

// ========================
//   AUTH/LOGOUT
// ========================
test('POST /auth/logout, logout a logged in user', async () => {
  const res = await request(app.listen())
    .post('/auth/logout')
    .set({ 'X-APP-SESSION-TOKEN': mocks.session.token })
    .expect(200);
  expect(res.body.success).toBe(true);
});

test("POST /auth/logout, doesn't logout an unauthenticated user", async () => {
  const res = await request(app.listen())
    .post('/auth/logout')
    .set({ 'X-APP-SESSION-TOKEN': '123e4567-e89b-12d3-a456-426655440000' })
    .expect(401);
});

// ========================
//   AUTH/VERIFY
// ========================
test('GET /auth/verify, throws 400 when querystring is invalid', async () => {
  const res = await request(app.listen()).get('/auth/verify?token=test').expect(400);
});

test('GET /auth/verify, throws 400 when the user is not found', async () => {
  const res = await request(app.listen())
    .get(`/auth/verify?token=${mocks.user.verifyEmailToken}&email=fake@fake.com`)
    .expect(400);
});

test('GET /auth/verify, succeeds with valid input', async () => {
  const res = await request(app.listen())
    .get(`/auth/verify?token=${mocks.user.verifyEmailToken}&email=${mocks.user.email}`)
    .expect('Content-Type', /html/)
    .expect(200);
});

// ========================
//   AUTH/FORGOT
// ========================
test('POST /auth/forgot, throws 400 when email is invalid', async () => {
  const res = await request(app.listen())
    .post('/auth/forgot')
    .send({ email: 'michaeltest.com' })
    .expect(400);
  expect(res.body).toEqual({});
});

test('POST /auth/forgot, throws 404 when user is not found', async () => {
  const res = await request(app.listen())
    .post('/auth/forgot')
    .send({ email: 'michael@test.com' })
    .expect(404);
  expect(res.body).toEqual({});
});

test('POST /auth/forgot, sends a mail when succeeds', async () => {
  const mandrillService = require('../../services/mandrill');
  const res = await request(app.listen())
    .post('/auth/forgot')
    .send({ email: mocks.user.email })
    .expect(200);
  expect(res.body.success).toBe(true);
  expect(mandrillService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
});

// ========================
//   AUTH/RESET
// ========================
test('GET /auth/reset, throws 400 when querystring is invalid', async () => {
  const res = await request(app.listen()).get('/auth/reset?token=test').expect(400);
});

test('GET /auth/reset, succeeds with valid input', async () => {
  const res = await request(app.listen())
    .get(`/auth/reset?token=${mocks.user.resetPasswordToken}&email=${mocks.user.email}`)
    .expect('Content-Type', /html/)
    .expect(200);
});

test('POST /auth/reset, throws 400 when input is invalid', async () => {
  const res = await request(app.listen()).post('/auth/reset').send({ token: 'a' }).expect(400);
});

test('POST /auth/reset, redirects to 302 when password is not provided', async () => {
  const res = await request(app.listen())
    .post('/auth/reset')
    .send({ token: 'test', email: 'michael@test.com' })
    .expect('location', /error=Required field: password/)
    .expect(302);
});

test('POST /auth/reset, redirects to 302 when user is not found', async () => {
  const res = await request(app.listen())
    .post('/auth/reset')
    .send({ token: 'test', email: 'michael@test.com', password: '123456789' })
    .expect('location', /error=Password reset token is invalid or has expired/)
    .expect(302);
});

test('POST /auth/reset, succeeds with valid input', async () => {
  const res = await request(app.listen())
    .post('/auth/reset')
    .send({ token: mocks.user.resetPasswordToken, email: mocks.user.email, password: '123456789' })
    .expect('Content-Type', /html/)
    .expect(200);
});
