
const { Schema, model } = require("mongoose");

const todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { versionKey: false }
);

const ToddoModel = model("todo", todoSchema);

module.exports = ToddoModel;