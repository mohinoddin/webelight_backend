const app = require("./index");
require("dotenv").config();
const mongoose = require("mongoose");


const LINK = process.env.ATLAS_URI;

//to start the server
app.listen(process.env.PORT || 3000, (err) => {
  if (!err) {
      console.log("Server Started");
  } else {
      console.log(err);
  }
});
const mongoURL = process.env.ATLAS_URI
 mongoose.connect(mongoURL, () => {
    console.log("Connected to db")
}, (err) => {
    console.log(err);
});