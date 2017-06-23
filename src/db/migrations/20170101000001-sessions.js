exports.up = async knex => {
  return knex.schema
    .createTable('sessions', table => {
      table.uuid('id').unique().primary().notNullable();
      table.string('token').unique().notNullable();
      table.uuid('userId').notNullable().references('id').inTable('users');
      table.string('ipAddress').notNullable();
      table.string('userAgent');
      table.timestamp('loggedOutAt');
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('expiresAt').notNullable().defaultTo(knex.raw(`now() + INTERVAL '2 weeks'`));
    })
    .raw(
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
  return knex.schema.raw(`DROP VIEW "activeSessions"`).dropTable('sessions');
};
