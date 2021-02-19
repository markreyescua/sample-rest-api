const { validationResult } = require("express-validator");

const Feed = require("../models/feed");

exports.getFeeds = (req, res, next) => {
  Feed.find()
    .then((feeds) => {
      res.status(200).json({
        message: "Successfully got feeds!",
        feeds: feeds,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.getFeed = (req, res, next) => {
  const feedId = req.params.id;
  Feed.findById(feedId)
    .then((feed) => {
      if (!feed) {
        const error = new Error("No feed with matching id found.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Successfully got feed!",
        feed: feed,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.postFeeds = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Feed({
    title: title,
    content: content,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg",
    creator: {
      name: "Mark Edison Cua",
    },
  });
  post
    .save()
    .then(() => {
      res.status(201).json({
        message: "Successfully posted feed!",
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
