const request = require("supertest"); // allows http requests
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
let server;

describe("auth middleware", async () => {
  let token;

  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  const exec = async () => {
    return await request(server)
      .post("/api/vidly/genres")
      .set("x-auth-token", token)
      .send({ name: "genre" }); // return promise immediately, await when calling exec()
  };

  //   beforeEach(() => {
  //     token = new User().generateAuthToken();
  //   });

  // it("should return 401 if no token is provided", async () => {
  //   token = "";
  //   const res = await exec();
  //   expect(res.status).toBe(401);
  // });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if no token is invalid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
