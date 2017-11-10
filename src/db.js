const knex = require('knex')({
  client: 'pg',
  connection: process.env.DB_CONNECTION,
});

module.exports = knex