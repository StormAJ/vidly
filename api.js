const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost/rental")
  .then(() => console.log("Connected to mongodb rental .."))
  .catch(err => console.log(err.message));

const Rental = mongoose.model("Rentals", {
  name: String,
  ratePerHour: Number
});

app.get("/api/rentals", async (req, res) => {
  const rentals = await Rental.find().sort("name");
  res.send(rentals);
});
app.post("/api/rentals", async (req, res) => {
  let rental = new Rental({
    name: req.body.name,
    ratePerHour: req.body.ratePerHour
  });
  rental = await rental.save();
  res.send(rental);
});

app.listen(3000, () => console.log(`Listening to port 3000 ..`));
