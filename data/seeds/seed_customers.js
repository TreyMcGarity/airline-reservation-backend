exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('customers').del();

  // Insert seed entries with plain text passwords (TEMPORARY)
  await knex('customers').insert([
    {
      first_name: 'John',
      last_name: 'Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: 'password'
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      phone: '0987654321',
      email: 'jane.smith@example.com',
      password: 'password'
    },
    {
      first_name: 'Alice',
      last_name: 'Johnson',
      phone: '5551234567',
      email: 'alice.johnson@example.com',
      password: 'password'
    }
  ]);
};
