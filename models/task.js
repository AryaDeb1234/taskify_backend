
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
    createdAt: { type: Date, default: Date.now },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);
