const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

// GET /tasks: Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks: Add a new task with description and date
app.post('/tasks', (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description,  // Add description
    date: req.body.date,  // Add date field
    completed: false
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id: Update an existing task (title, description, date)
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (task) {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.date = req.body.date || task.date;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// DELETE /tasks/:id: Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

// GET /tasks/calendar: Get tasks based on date for calendar view
app.get('/tasks/calendar', (req, res) => {
  const date = req.query.date;
  const filteredTasks = tasks.filter(task => task.date === date);
  res.json(filteredTasks);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
