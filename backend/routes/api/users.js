// backend/routes/api/users.js
const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({checkFalsy: true})
    .withMessage("Username is required"),
  check("username")
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({checkFalsy: true})
    .withMessage("First Name is required"),
  check("lastName")
    .exists({checkFalsy: true})
    .withMessage("Last Name is required"),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;
  const emailOrUsernameExists = await User.findOne({
    where: {
      [Op.or]: [
        {email},
        {username}
      ]
    },
  });

  // const usernameExists = await User.findOne({
  //   where: {
  //     username: username,
  //   },
  // });

  // if (emailExists) {
  //   const err = new Error("User already exists");
  //   err.status = 403;
  //   err.errors = ["User with that email already exists"];
  //   return next(err);
  // }

  if (emailOrUsernameExists) {
    const err = new Error("User already exists");
    err.status = 403;
    err.errors = ["User with that username or email already exists"];
    return next(err);
  }

  const user = await User.signup({
    firstName,
    lastName,
    email,
    username,
    password,
  });

  await setTokenCookie(res, user);

  return res.json({
    user: user,
  });
});

module.exports = router;
