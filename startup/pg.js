const pool = require("../config/pg");
const config = require("config");

module.exports = async function() {
  const pg = config.get("PGHOST");
  // console.log("PGHOST: ", pg);
  pool
    .connect()
    // .then(() => winston.info(`Connected to Postgress ..`))
    .then(() => console.log(`Connected to ${pg} ..`))
    .catch(err => console.log(`PGHOST: ${pg} Error: ${err}`));
  // await pool.query("CREATE DATABASE vidly"); // funktioniert initial nur mit database: "postgres" in Pool attributen
  pool
    .query(
      "CREATE TABLE IF NOT EXISTS users (last_name character varying, email character varying)"
    )
    .catch(err => console.log("Cannot create table", err));
  // pool.end();
};
