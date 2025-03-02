exports.up = function(knex) {
    return knex.schema.createTable('customers', (table) => {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('phone').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('password', 255).notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('customers');
  };
  