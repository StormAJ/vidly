const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", async () => {
  it("should populate req.user with valid jwt", async () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(), // use toHexString to allow using expext( ..).toMatchObject(..)
      isAdmin: true
    };
    const token = new User(user).generateAuthToken();
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
