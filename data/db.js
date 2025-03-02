const knex = require('knex');
require('dotenv').config();

const config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('render') ? { rejectUnauthorized: false } : false,
  },
};

// const config = require('../knexfile').development;

const db = knex(config);

module.exports = db;