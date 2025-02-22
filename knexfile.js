module.exports = {
  development: {
    client: 'pg',
    connection: {
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			host: process.env.DB_SERVER,
			port: process.env.DB_PORT,
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  }
};
