const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const validator = require("../middleware/validate");

router.post("/", [auth, validator(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found");
  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.return();

  await rental.save();

  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

  return res.send(rental); // .status(200) is set by default;
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
