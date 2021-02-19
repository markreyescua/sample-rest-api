const { validationResult } = require("express-validator");

const Feed = require("../models/feed");

exports.getFeeds = (req, res, next) => {
  Feed.find()
    .then((feeds) => {
      res.status(200).json({
        message: "Successfully get feeds!",
        feeds: feeds,
      });
    })
    .catch((error) => {
      console.log(error);
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
        message: "Successfully post feeds!",
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
