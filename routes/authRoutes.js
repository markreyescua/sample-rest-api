const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const controller = require("../controllers/authController");
const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists!");
          }
        });
      }),
    body("password").trim().isLength({ min: 8 }),
    body("name").trim().not().isEmpty(),
  ],
  controller.signup
);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

module.exports = router;
