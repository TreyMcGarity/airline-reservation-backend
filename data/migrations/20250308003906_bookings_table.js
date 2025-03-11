exports.up = function (knex) {
    return knex.schema.createTable("bookings", function (table) {
      table.increments("id").primary();
      table.integer("customer_id").unsigned().notNullable();
      table.integer("flight_id").unsigned().notNullable();
      table.string("status").defaultTo("pending");
      table.timestamp("created_at").defaultTo(knex.fn.now());
  
      table.foreign("customer_id").references("id").inTable("customers").onDelete("CASCADE");
      table.foreign("flight_id").references("id").inTable("flights").onDelete("CASCADE");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("bookings");
  };
  