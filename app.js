const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const MONGODB_URI =
  "mongodb+srv://markreyescua:THGd6eTVo6y65Syt@cluster0.fbwmq.mongodb.net/sample-rest-api?retryWrites=true&w=majority";

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// controllers
const feedRoutes = require("./routes/feedRoutes");

// middlewares
app.use(cookieParser());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(
  session({
    secret: "THGdTHGd6eTVo6yTHGd6eTVo6y65Syt65Syt6eTVoTHGd6eTVo6y65Syt6y65Syt",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feeds", feedRoutes);

mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to our database!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
