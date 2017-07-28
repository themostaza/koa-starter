exports.up = async knex => {
  return knex.schema.createTable('messages', table => {
    table.uuid('id').unique().primary().notNullable();
    table.uuid('userId').notNullable().references('id').inTable('users');
    table.string('text');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async knex => {
  return knex.schema.dropTable('messages');
};
