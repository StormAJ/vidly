const express = require("express");
const router = express.Router();
// const index = require("../views/index.pug");

router.get("/", (req, res) => {
  return res.send(" V I D L Y - api 5");
  // return res.render.render(index, {
  //   title: "My express app",
  //   message: "Hello"
  // }); //renders html as defined in template ./views/index.pug
});

// router.get("/", async (req, res) => {
//   const genres = await Genre.find().sort("name");
//   return res.send(genres);
// });

module.exports = router;
