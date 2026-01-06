require('dotenv').config();
const keys = require("./keys");

// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("connect", client => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.log("PG ERROR", err));
});

//Express route definitions
app.get("/api/", (req, res) => {
  res.send("Hi");
});

// get the values
app.get("/api/values/all", async (req, res) => {
  try {
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values);
  } catch (err) {
    console.error("Error fetching values:", err);
    res.status(500).send({ error: "Database error" });
  }
});

// now the post -> insert value
app.post("/api/values", async (req, res) => {
  const value = req.body.value;
  if (!value) {
    return res.status(400).send({ working: false, error: "Value is required" });
  }

  try {
    await pgClient.query("INSERT INTO values(number) VALUES($1)", [value]);
    res.send({ working: true });
  } catch (err) {
    console.error("Error inserting value:", err);
    res.status(500).send({ error: "Database error" });
  }
});

app.listen(5000, err => {
  console.log("Listening");
});
