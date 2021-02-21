const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Feed = require("../models/feed");
const User = require("../models/user");

exports.getFeeds = async (req, res, next) => {
  let currentPage = +req.query.page || 1;
  let perPage = +req.query.count || 2;
  let nextPage = +currentPage;
  let totalPage = 0;

  try {
    const count = await Feed.find().countDocuments();
    totalPage = Math.ceil(count / perPage);
    if (totalPage <= currentPage) {
      nextPage = currentPage;
    } else {
      nextPage = currentPage + 1;
    }

    const feeds = await Feed.find()
      .select("-_id -__v -updatedAt")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

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
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getFeed = async (req, res, next) => {
  const feedId = req.params.id;

  try {
    const feed = await Feed.findById(feedId);
    if (!feed) {
      const error = new Error("No feed with matching id found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Successfully got feed!",
      feed: feed,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postFeeds = async (req, res, next) => {
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
    creator: req.userId,
  });

  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.feeds.push(post);
    await user.save();
    res.status(201).json({
      message: "Successfully posted feed!",
      feed: post,
      creator: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateFeed = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const feedId = req.params.id;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const feed = await Feed.findById(feedId);
    if (!feed) {
      const error = new Error("Could not find feed.");
      error.statusCode = 404;
      throw error;
    }
    if (feed.creator.toString() !== req.userId) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    feed.title = title;
    feed.content = content;
    await feed.save();
    res.status(201).json({
      message: "Successfully updated feed!",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteFeed = async (req, res, next) => {
  const feedId = req.params.id;
  try {
    const feed = await Feed.findById(feedId);
    if (!feed) {
      const error = new Error("No feed with matching id found.");
      error.statusCode = 404;
      throw error;
    }
    if (feed.creator.toString() !== req.userId) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    clearImage(feed.imageUrl);
    await Feed.findByIdAndRemove(feedId);
    const user = await User.findById(req.userId);
    user.feeds.pull(feedId);
    await user.save();
    res.status(200).json({
      message: "Successfully deleted feed!",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
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
