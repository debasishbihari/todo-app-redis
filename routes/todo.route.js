const ToddoModel = require("../models/todo.model");
const express = require("express");

const app = express.Router();


app.get("/", async (req, res) => {
  try {
    const allTodo = await ToddoModel.find();

    return res.send({ allTodo });
  } catch (e) {
    return res.send(e.message);
  }
});

// post request*******

app.post("/create", async (req, res) => {
  const { title,description } = req.body;

  try {
    const newTodo = new ToddoModel({ title, description });
    await newTodo.save();

    return res.send("New Toddo Added in the list");
  } catch (e) {
    return res.send(e.message);
  }
  res.send("reading todo file");
});

// patch request*******

app.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  console.log(status);
  try {
    const newTodo = await ToddoModel.findOne({ _id: id });
    if (!newTodo) {
      return res.send("there is no toddo with the given id : ", id);
    }

    let updatedTodo = await ToddoModel.updateOne(
      {
        _id: id,
      },
      { $set: { title: title } }
    );

    return res.send("updated");
  } catch (e) {
    return res.send(e.message);
  }
  //   res.send("reading todo file");
});

// put request*******

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title,description } = req.body;
  console.log(status);
  try {
    const newTodo = await ToddoModel.findOne({ _id: id });
    if (!newTodo) {
      return res.send("there is no toddo with the given id : ", id);
    }

    let updatedTodo = await ToddoModel.updateOne(
      {
        _id: id,
      },
      { $set: { title:title } }
    );

    return res.send("updated");
  } catch (e) {
    return res.send(e.message);
  }
  //   res.send("reading todo file");
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { title,description } = req.body;
  console.log(status);
  try {
    const newTodo = await ToddoModel.findOne({ _id: id });
    if (!newTodo) {
      return res.send("there is no toddo with the given id : ", id);
    }

    let updatedTodo = await ToddoModel.findByIdAndDelete({
      _id: id,
    });

    return res.send("deleted");
  } catch (e) {
    return res.send(e.message);
  }
  //   res.send("reading todo file");
});

app.get('/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    // Search for tasks that match the query in either the title or description
    const todos = await TodoModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive matching for title
        { description: { $regex: query, $options: 'i' } } // Case-insensitive matching for description
      ]
    });
    
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while searching for tasks.' });
  }
});


module.exports = app;