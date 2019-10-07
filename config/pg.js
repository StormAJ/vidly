const { Client, Pool } = require("pg");
const config = require("config");

const pghost = config.get("PGHOST");

module.exports = new Pool({
  host: pghost, // verweist auf image in docker-compose.yml, default: localhost
  user: "postgres",
  database: "postgres",
  password: "1234"
});
