[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) 

&nbsp;

# koa-starter  <img src="https://s-media-cache-ak0.pinimg.com/originals/8e/00/2f/8e002f2f46190b78f2dbc7683b225759.gif" width="110" align="left">
Our Koa starter kit

&nbsp;

## Description

This project aims at being a "starter kit" for the apps we develop everyday at [Mostaza](http://www.themostaza.com/).  
We've been [parse-server](https://github.com/parse-community/parse-server) users since its first open source release and we enjoyed it a lot so far, but at the same time we've always looked for more customizable alternative with a smaller footprint, hence we started working on this repo.  

*Warning: Still a work in progress*.  

## Features

*N.B.: A feature should be checked as done only when paired with failing and working tests*. 

**Middlewares:**  
- [x] Secured routes from unauthenticated access - `middlewares/ensureAuthenticated`
- [x] Enhanced Koa context with current user - `middlewares/userFromSession`
- [x] Handled parameters validation - `middlewares/validationHandler` and `koa-bouncer`
- [x] Handled cross domain requests - `middlewares/allowCrossDomain`
- [x] Add defaults variables to the response - `middlewares/responseDefaults`

**Authentication using session tokens (parse-server docet):**  
- [x] Signup - `POST /api/v1/auth/signup` 
- [x] Login - `POST /api/v1/auth/login` 
- [x] Logout - `POST /api/v1/auth/logout`
- [x] Email Verification - `GET /api/v1/auth/verify`
- [x] Password reset email request - `POST /api/v1/auth/forgot`
- [x] Password reset page - `GET /api/v1/auth/reset`
- [x] Password reset handling - `POST /api/v1/auth/reset`

**Authorization: WIP**  

**Entities CRUD:**  
- [x] Message: create - `POST /api/v1/messages` 
- [x] Message: delete - `DELETE /api/v1/messages/:id` 
- [x] Message: get all - `GET /api/v1/messages` 
- [ ] ...other

**Utilities:**  
- [x] Simple logging (not in TEST) 

## Setup

You must have Postgres installed. I recommend http://postgresapp.com/ for OSX.
```
git clone git@github.com:themostaza/koa-starter.git
cd koa-starter
touch .env
yarn install
yarn run start-dev

> Server is listening on http://localhost:3000...
```

Create a `.env` file in the root directory which will let you set environment variables. `yarn run start-dev` will read from it.

Example `.env`:
```
DATABASE_URL=postgres://username:password@localhost:5432/my-database
MAIL_FROM_ADDRESS=info@themostaza.com
MANDRILL_API_KEY=secret-api-key
HTML_VERIFY_EMAIL_SUCCESS_PATH=./public_html/verify_email_success.html
HTML_PASSWORD_UPDATE_REQUEST_PATH=./public_html/password_update_request.html
HTML_PASSWORD_UPDATE_SUCCESS_PATH=./public_html/password_update_success.html
```

## Acknowledgements:

We are grateful to the authors of existing related projects for their ideas and collaboration:
- [@danneu](https://github.com/danneu)
