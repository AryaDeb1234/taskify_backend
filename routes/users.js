var express = require('express');
var router = express.Router();
var task = require("../models/task");
var passport = require("passport");

const isAuthenticated = passport.authenticate("jwt", { session: false });


router.get('/', isAuthenticated, async function (req, res, next) {
  try {
    let tasks = await task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/completed', isAuthenticated, async (req, res) => {
  try {
    const completedTasks = await task.find({
      user: req.user._id,    
      completed: true        
    });
    res.json(completedTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post('/', isAuthenticated, async function (req, res, next) {
  let { title, description } = req.body;

  let newtask = new task({
    title,
    description,
    user: req.user._id
  });

  try {
    await newtask.save();
    res.status(201).json(newtask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task
router.put("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.patch("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body }, // update only provided fields
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



router.delete('/:id', isAuthenticated, async function (req, res, next) {
  try {
    const deletedTask = await task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.status(204).end(); // No content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

