const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../config/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//api/users/register
router.post("/register", async (req, res) => {
  //validation
  //   const validation = Joi.validate(req.body, schema);
  //   const { error } = await schema.validate(req.body);
  const { error } = await registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //checking for matching email
  const emailMatch = await User.findOne({ email: req.body.email });
  if (emailMatch) return res.status(400).send("email already exist");

  // Hash our password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // we create a new user here
  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  // we catch the error here
  try {
    const savedUser = await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
});

//api/users/login
router.post("/login", async (req, res) => {
  const { error } = await loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //checking for matching email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email or password is wrong");

  //check if password is valid
  const validPassword = await bcrypt.compareSync(
    req.body.password,
    user.password
  );
  if (!validPassword) return res.status(400).send("invalid password");
  //authentication with jwt
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});
module.exports = router;
