exports.up = function (knex) {
    return knex.schema.createTable("bookings", function (table) {
      table.increments("id").primary();
      table.integer("customer_id").unsigned().notNullable()
           .references("id").inTable("customers").onDelete("CASCADE");
      table.integer("flight_id").unsigned().notNullable()
           .references("id").inTable("flights").onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.string("status").defaultTo("confirmed");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("bookings");
  };
  