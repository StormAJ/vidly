const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");

const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) res.status(404).send("no rental found");
  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customerId");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movieId");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not on stock");

  const rental = new Rental({
    // creates new ID
    customer: { _id: customer._id, name: customer.name, phone: customer.phone }, // embedding subset of porperties
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  //   rental = await rental.save();
  //   movie.numberInStock--;
  //   movie.save();
  try {
    new Fawn.Task() // transaction: rolls back all operations, if one fails (transactions saved in separate collection)
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();
    res.send(rental);
  } catch (err) {
    res.status(500).send("Something failed");
  }
});

// router.put("/:id", async (req, res) => {
//   const { error  } = validate(req.body);
//   if (err) return res.status(400).send("err.details[0].message");

//   const customer = await Customer.findById(req.body.genreId);
//   if (!customerId) return res.status(400).send("no valid customer");

//   const movie = await Movie.findByIdAndUpdate(
//     req.params.id,
//     {
//       title: req.body.title,
//       genre: { _id: req.body.genreId, name: genre.name },
//       numberInStock: req.numberInStock,
//       dailyRentalRate: req.body.dailyRentalRate
//     },
//     { new: true }
//   );
//   if (!movie) return res.status(404).send("no movie found");
//   res.send(movie);
// });

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.body.id);
  if (!movie) res.status(404).send("no movie found");
  res.send(movie);
});

module.exports = router;
