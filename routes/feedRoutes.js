const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedController");

router.get("/", controller.getFeeds);

router.post("/", controller.postFeeds);

module.exports = router;
