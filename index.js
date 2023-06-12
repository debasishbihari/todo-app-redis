//require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const connect = require("./config/db");
const cors = require("cors");
const { urlencoded } = require("express");
const app = express();
const ToddoRoute = require("./routes/todo.route");

app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  return res.send("server is working fine...............");
});

app.use("/todo", ToddoRoute);
app.listen(PORT, async () => {
  await connect();
  console.log("server is connect on ", PORT);
});