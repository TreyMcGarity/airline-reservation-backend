exports.up = function(knex) {
    return knex.schema.createTable('flights', (table) => {
      table.increments('id').primary();
      table.string('origin').notNullable();
      table.string('destination').notNullable();
      table.date('date').notNullable();
      table.integer('passenger_count').notNullable();
      table.string('time').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.string('airline').notNullable();
      table.integer('seat_availability').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('flights');
  };
  