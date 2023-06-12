const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a task
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  try {
    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndDelete(taskId);
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Search tasks
router.get('/search', async (req, res) => {
  const { q: query } = req.query;

  try {
    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
