exports.getFeeds = (req, res, next) => {
  res.status(200).json({
    message: "Successfully get feeds!",
    feeds: [],
  });
};

exports.postFeeds = (req, res, next) => {
  const title = req.body.title;
  const message = req.body.message;
  res.status(200).json({
    message: "Successfully post feeds!",
    feeds: [
      {
        title: title,
        message: message,
      },
    ],
    created_at: new Date().toUTCString(),
  });
};
