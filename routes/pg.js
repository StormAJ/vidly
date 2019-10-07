const express = require("express");
const router = express.Router();
const pool = require("../config/pg");

const table = "users";

router.get("/", async (req, res) => {
  const users = await pool.query(`SELECT * FROM ${table}`);
  // .catch(err => console.log(err));
  return res.send(users.rows);
});

router.post("/", async (req, res) => {
  const last_name = req.body.last_name;
  const email = req.body.email;
  const text = `INSERT INTO ${table} (last_name, email) VALUES ('${last_name}', '${email}')`;
  const users = await pool.query(text);
  return res.send(users.rows);
});

module.exports = router;
