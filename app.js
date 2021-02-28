const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const constants = require("./util/constants");

const app = express();

const store = new MongoDbStore({
  uri: constants.MONGODB_URI,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// controllers
const feedRoutes = require("./routes/feedRoutes");
const authRoutes = require("./routes/authRoutes");
const { init } = require("./models/feed");

// middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: constants.SESSION_SECRET,
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

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use(helmet());
app.use(compression());

// Error Handler
app.use((error, req, res, next) => {
  const status = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose.set("useUnifiedTopology", true);
console.log(constants.MONGODB_URI);
mongoose
  .connect(constants.MONGODB_URI)
  .then(() => {
    console.log("Connected to then server");
    const server = app.listen(constants.SERVER_PORT);
    const io = require("./appSocket").init(server);
    io.on("connection", (socket) => {
      console.log(`connected: ${socket}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
