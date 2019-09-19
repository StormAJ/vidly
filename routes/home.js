const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "My express app", message: "Hello" }); //renders html as defined in template ./views/index.pug
});

module.exports = router;
