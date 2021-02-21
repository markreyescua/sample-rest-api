const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Feed = require("../models/feed");

exports.getFeeds = (req, res, next) => {
  let currentPage = req.query.page || 1;
  let perPage = req.query.count || 2;
  let totalPage = 0;
  let nextPage = +currentPage + 1;

  Feed.find()
    .countDocuments()
    .then((count) => {
      totalPage = Math.ceil(count / perPage);
      if (totalPage <= currentPage) {
        nextPage = currentPage;
      }
      return Feed.find()
        .select("-_id -__v -updatedAt")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((feeds) => {
      if (feeds.length < 1) {
        const error = new Error("No feeds available.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Successfully got feeds!",
        total_page: totalPage,
        current_page: currentPage,
        next_page: nextPage,
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
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const post = new Feed({
    title: title,
    content: content,
    imageUrl: `http://localhost:3000/${imageUrl}`,
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

exports.updateFeed = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const feedId = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  Feed.findById(feedId)
    .then((feed) => {
      feed.title = title;
      feed.content = content;
      return feed.save();
    })
    .then(() => {
      res.status(201).json({
        message: "Successfully updated feed!",
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.deleteFeed = (req, res, next) => {
  const feedId = req.params.id;
  Feed.findById(feedId)
    .then((feed) => {
      if (!feed) {
        const error = new Error("No feed with matching id found.");
        error.statusCode = 404;
        throw error;
      }
      clearImage(feed.imageUrl);
      return Feed.findByIdAndRemove(feedId);
    })
    .then(() => {
      res.status(200).json({
        message: "Successfully deleted feed!",
      });
    })
    .catch((error) => {
      console.log(error);
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(
    __dirname,
    "..",
    filePath.replace("http://localhost:3000/", "")
  );
  fs.unlink(filePath, (error) => {
    console.log(error);
  });
};
