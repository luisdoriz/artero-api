const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 5000;

const users = require("./routes/api/users");
const patients = require("./routes/api/patients");
const profile = require("./routes/api/profile");

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'token, Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, x-chat-id'
  );
  if (req.method === 'OPTIONS') {
    res.send(204);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

const db = require("./config/keys").mongoURI;

//connect to MongoDb
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Artero running!"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());
// Passport Config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/patients", patients);
app.use("/api/profile", profile);

app.listen(port, () => console.log(`Server running on port ${port}`));
