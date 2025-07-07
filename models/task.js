const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Reference to User
}, 
{ timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);