exports.up = async knex => {
  return knex.schema.createTable('users', table => {
    table.uuid('id').unique().primary().notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.boolean('emailVerified').notNullable().defaultTo(false);
    table.string('verifyEmailToken');
    table.string('resetPasswordToken');
    table.timestamp('resetPasswordTokenExpiresAt');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('lastOnlineAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async knex => {
  return knex.schema.dropTable('users');
};
