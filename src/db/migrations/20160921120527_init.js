/* @flow */
exports.up = async knex => {
  await knex.schema.createTable('users', table => {
    table.uuid('id').unique().primary().notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.boolean('admin').notNullable().defaultTo(false);
    table.timestamp('createdAt').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('lastOnlineAt').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('now()'));
  });
  await knex.schema.createTable('sessions', table => {
    table.uuid('id').unique().primary().notNullable();
    table.string('token').unique().notNullable();
    table.uuid('userId').notNullable().references('id').inTable('users');
    table.string('ipAddress').notNullable();
    table.string('userAgent');
    table.timestamp('loggedOutAt');
    table.timestamp('createdAt').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('expiresAt').notNullable().defaultTo(knex.raw(`now() + INTERVAL '2 weeks'`));
  });
  await knex.schema.raw(
    `
        CREATE VIEW "activeSessions" AS
          SELECT *
          FROM "sessions"
          WHERE "expiresAt" > NOW()
            AND "loggedOutAt" IS NULL
        ;
      `
  );
};

exports.down = async knex => {
  await knex.schema.raw(`DROP VIEW "activeSessions"`);
  await knex.schema.dropTable('sessions');
  await knex.schema.dropTable('users');
};
