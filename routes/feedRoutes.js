const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controller = require("../controllers/feedController");
const isAuth = require("../middleware/is-auth");

// GET - /feeds
router.get("/", isAuth, controller.getFeeds);

// POST - /feeds
router.post(
  "/",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  controller.postFeeds
);

router.get("/:id", controller.getFeed);

router.put(
  "/:id",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  controller.updateFeed
);

router.delete("/:id", isAuth, controller.deleteFeed);

module.exports = router;
