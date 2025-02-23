exports.up = function(knex) {
    return knex.schema.createTable('flights', (table) => {
      table.increments('id').primary();
      table.string('origin').notNullable();
      table.string('destination').notNullable();
      table.string('arrival_time').notNullable();
      table.timestamp('departure_time').notNullable();
      table.integer('passenger_count').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.string('airline').notNullable();
      table.string('flight_number').notNullable();
      table.integer('duration').notNullable();
      table.integer('seat_availability').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('flights');
  };
  