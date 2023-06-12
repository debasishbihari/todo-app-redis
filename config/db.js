//require("dotenv").config();
const mongoose = require("mongoose");

const connect = async () => {
  try {
    return mongoose.connect("mongodb+srv://debasishbihari:debasishbihari@cluster0.ocr8wsm.mongodb.net/todos");
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

module.exports = connect;