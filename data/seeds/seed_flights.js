exports.seed = async function(knex) {
  // Deletes ALL existing entries in the flights table
  await knex('flights').del();

  // Inserts seed entries for the flights table
  await knex('flights').insert([
    {
      origin: 'JFK',
      destination: 'LAX',
      arrival_time: '10:00 AM',
      departure_time: '2025-04-01 07:00:00',
      passenger_count: 150,
      price: 350.00,
      airline: 'Delta',
      flight_number: 'DL101',
      duration: 6,
      seat_availability: 20
    },
    {
      origin: 'LAX',
      destination: 'ORD',
      arrival_time: '1:00 PM',
      departure_time: '2025-04-01 11:00:00',
      passenger_count: 140,
      price: 250.00,
      airline: 'United',
      flight_number: 'UA202',
      duration: 4,
      seat_availability: 25
    },
    {
      origin: 'ORD',
      destination: 'MIA',
      arrival_time: '6:00 PM',
      departure_time: '2025-04-02 15:00:00',
      passenger_count: 160,
      price: 300.00,
      airline: 'American Airlines',
      flight_number: 'AA303',
      duration: 3,
      seat_availability: 30
    },
    {
      origin: 'MIA',
      destination: 'ATL',
      arrival_time: '8:00 PM',
      departure_time: '2025-04-02 17:00:00',
      passenger_count: 100,
      price: 200.00,
      airline: 'Southwest',
      flight_number: 'SW404',
      duration: 3,
      seat_availability: 15
    },
    {
      origin: 'ATL',
      destination: 'SEA',
      arrival_time: '11:00 PM',
      departure_time: '2025-04-03 20:00:00',
      passenger_count: 120,
      price: 400.00,
      airline: 'Alaska Airlines',
      flight_number: 'AS505',
      duration: 5,
      seat_availability: 10
    }
  ]);
};
