# koa-starter  <img src="https://s-media-cache-ak0.pinimg.com/originals/8e/00/2f/8e002f2f46190b78f2dbc7683b225759.gif" width="110" align="left">
Our Koa starter kit

&nbsp;

## Description

This project aims at being a "starter kit" for the apps we develop everyday at [Mostaza](http://www.themostaza.com/).  
We've been [parse-server](https://github.com/parse-community/parse-server) users since its first open source release and we enjoyed it a lot so far, but at the same time we've always looked for more customizable alternative with a smaller footprint, hence we started working on this repo.  

*Warning: Still a work in progress*.  

## Features

N.B.: A feature should be checked as done only when paired with failing and working tests. 

**Middlewares:**  
- [x] Secure routes from unauthenticated access - `middlewares/assertAuthenticated`
- [x] Enhance Koa context with current user - `middlewares/userFromSession`

**Authentication using session tokens (parse-server docet):**  
- [x] Signup - `auth/signup` 
- [x] Login - `auth/login` 
- [x] Logout - `auth/logout`
- [x] Email Verification - `auth/verify`
- [ ] Password reset - `auth/verify`

**Authorization: WIP**  

**Entities CRUD: WIP**  

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
```

## P.S.: 
Thanks to [koa-skeleton](https://github.com/danneu/koa-skeleton) for many useful hints.
