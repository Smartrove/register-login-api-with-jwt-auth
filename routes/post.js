const router = require("express").Router();
const verification = require("../routes/jwt");

router.get("/", verification, (req, res) => {
  //   res.json({
  //     title: "My first post",
  //     description: "Random data you shouldnt access",
  //   });
  res.send(req.user);
});
module.exports = router;
