const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const request = require("supertest"); // allows http requests
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);
      const res = await request(server).get("/api/vidly/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return 404, if invalid id is passed", async () => {
      const res = await request(server).get("/api/vidly/genres/1");
      expect(res.status).toBe(404);
    });
    it("should return 404, if no genre with given id exists", async () => {
      const genre = new Genre();
      const res = await request(server).get("/api/vidly/genres/" + genre._id);
      expect(res.status).toBe(404);
    });

    it("should return genre, if valid id is passed", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const genre = new Genre({
        _id: id,
        name: "genre"
      });
      await genre.save();
      const res = await request(server).get("/api/vidly/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", id);
      // expect(res.body).toMatchObject(genre);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/vidly/genres")
        .set("x-auth-token", token)
        .send({ name }); // equates .send({ name: name });
    };

    beforeEach(() => {
      // defines values for happy path
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401, if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400, if genre is less than 5 char", async () => {
      name = "aaa";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400, if genre is longer than 255 char", async () => {
      name = new Array(22).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save genre on db, if valid genre is passed", async () => {
      await exec();
      const genre = await Genre.find({ name: "genre" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre, if valid genre is passed", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id"); // must not use .toMatchOject()
      expect(res.body).toHaveProperty("name", name);
    });
  });

  // describe("DELETE /:id", () => {
  //   let token;
  //   let genre;
  //   let id;

  //   const exec = async () => {
  //     return await request(server)
  //       .delete("/api/vidly/genres/" + id)
  //       .set("x-auth-token", token)
  //       .send();
  //   };

  //   beforeEach(async () => {
  //     // Before each test we need to create a genre and
  //     // put it in the database.
  //     genre = new Genre({ name: "genre1" });
  //     await genre.save();

  //     id = genre._id;
  //     token = new User({ isAdmin: true }).generateAuthToken();
  //   });

  //   // it("should return 401 if client is not logged in", async () => {
  //   //   token = "";

  //   //   const res = await exec();

  //   //   expect(res.status).toBe(401);
  //   // });

  //   // it("should return 403 if the user is not an admin", async () => {
  //   //   token = new User({ isAdmin: false }).generateAuthToken();

  //   //   const res = await exec();

  //   //   expect(res.status).toBe(403);
  //   // });

  //   // it("should return 404 if id is invalid", async () => {
  //   //   id = 1;

  //   //   const res = await exec();

  //   //   expect(res.status).toBe(404);
  //   // });

  //   // it("should return 404 if no genre with the given id was found", async () => {
  //   //   id = mongoose.Types.ObjectId();

  //   //   const res = await exec();

  //   //   expect(res.status).toBe(404);
  //   // });

  //   it("should delete the genre if input is valid", async () => {
  //     await exec();

  //     const genreInDb = await Genre.findById(id);

  //     expect(genreInDb).toBeNull();
  //   });

  //   it("should return the removed genre", async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty("_id", genre._id.toHexString());
  //     expect(res.body).toHaveProperty("name", genre.name);
  //   });
  // });

  describe("DELETE /:id", () => {
    let token;
    let genre;

    const exec = async () => {
      return await request(server)
        .delete("/api/vidly/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      genre = new Genre({ name: "genre" });
      await genre.save();
    });

    it("should return 404 if genre not found", async () => {
      genre._id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      let genreInDb = await Genre.findById(genre._id);
      expect(genreInDb).not.toBeNull();

      const res = await exec();
      expect(res.body.name).toMatch(genre.name);

      genreInDb = await Genre.findById(genre._id);
      expect(genreInDb).toBeNull();
    });
  });

  describe("PUT /:id", () => {
    let token;
    let name;
    let genre;

    const exec = async () => {
      return await request(server)
        .put("/api/vidly/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      genre = new Genre({ name: "genre" });
      await genre.save();
      id = genre._id;
      name = "genre2";
    });

    it("should return 400 if invalid valid genre.name has been passed", async () => {
      name = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if no genre with given id found", async () => {
      genre._id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return genre if genre valid genre has been passed", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", name);
    });

    it("should update genre on db, if valid genre is passed", async () => {
      await exec();
      await Genre.find({ name });
      expect(genre).not.toBeNull();
    });
  });
});
