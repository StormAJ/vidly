const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const request = require("supertest"); // allows http requests
const moment = require("moment");
const { Movie } = require("../../models/movie");

describe("api/vidly/rentals", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "customer1",
        phone: "12345",
        isGold: true
      },
      movie: {
        _id: movieId,
        title: "title1",
        dailyRentalRate: 2
      }
    });
    await rental.save();

    const movie = new Movie({
      _id: movieId,
      title: "title1",
      genre: {
        name: "genre1"
      },
      numberInStock: 1,
      dailyRentalRate: 2
    });
    await movie.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  const exec = () => {
    return request(server) // retuns promise, called of exec to await promise passed by return
      .post("/api/vidly/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    // delete playload.customerId; // Alternative: delete property
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if movie Id is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    await rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental already processed", async () => {
    rental.dateReturned = new Date(); // creates new property
    await rental.save(); // saves rental object to same ._id
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set return date w/ delta less than 10s", async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000); // 10s
  });

  it("should set the rental fee", async () => {
    rental.dateOut = moment() // reset date set by mongoose
      .add(-7, "days")
      .toDate();
    await rental.save();
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase numbers on stock", async () => {
    await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(2);
  });

  it("should return the rental", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    // expect(res.body).toHaveProperty("dateOut");
    // expect(res.body).toHaveProperty("dateReturned");
    // expect(res.body).toHaveProperty("rentalFee");
    // expect(res.body).toHaveProperty("customer");
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie"
      ])
    );
  });
});
