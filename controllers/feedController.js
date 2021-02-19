const { validationResult } = require("express-validator");

exports.getFeeds = (req, res, next) => {
  res.status(200).json({
    message: "Successfully get feeds!",
    feeds: [
      {
        _id: 1,
        title: "Harry Potter",
        content: "This is my favorite book!",
        imageUrl:
          "https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg",
        creator: {
          name: "Mark Edison Cua",
        },
        created_at: new Date().toISOString(),
      },
    ],
  });
};

exports.postFeeds = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: "Validation failed, entered data is incorrect",
        errors: errors.array(),
      });
  }
  const title = req.body.title;
  const message = req.body.message;
  res.status(201).json({
    message: "Successfully post feeds!",
    feeds: [],
  });
};
