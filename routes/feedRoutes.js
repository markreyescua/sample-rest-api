const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controller = require("../controllers/feedController");

// GET - /feeds
router.get("/", controller.getFeeds);

// POST - /feeds
router.post(
  "/",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  controller.postFeeds
);

router.get("/:id", controller.getFeed);

router.put(
  "/:id",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  controller.updateFeed
);

router.delete("/:id", controller.deleteFeed);

module.exports = router;
