module.exports = {
  MONGODB_URI: `mongodb+srv://markreyescua:THGd6eTVo6y65Syt@cluster0.fbwmq.mongodb.net/sample-rest-api?retryWrites=true&w=majority`,
  JWT_SECRET_KEY: "AIpYJKVafbhsvyzAbYz0eoF9wVC4saK4",
  SESSION_SECRET: "akixuTDIZQVciUD6P4Uue9FnvexoLOH2",
  SERVER_PORT: 3000,
  // MONGODB_URI: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.fbwmq.mongodb.net/${process.env.MONGODB_CLUSTER}?retryWrites=true&w=majority`,
  // JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  // SESSION_SECRET: process.env.SESSION_SECRET,
  // SERVER_PORT: process.env.SERVER_PORT,
};
