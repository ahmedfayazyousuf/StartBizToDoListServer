const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://startbiztodolistclient.vercel.app",
  "https://startbiztodolistclient-c3td5r44i-ahmed-fayaz-yousufs-projects.vercel.app",
  "https://startbiztodolistclient-git-master-ahmed-fayaz-yousufs-projects.vercel.app/"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

let tasks = [];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

app.post('/tasks', (req, res) => {
  const { title, description, firstName, lastName, email, phone, date } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    firstName,
    lastName,
    email,
    phone,
    date,
    status: 'pending'
  };

  tasks.push(newTask);
  io.emit('taskPending', newTask);  
  res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
  const acceptedTasks = tasks.filter(task => task.status === 'accepted');
  res.json(acceptedTasks);
});

app.get('/admin/tasks', (req, res) => {
  res.json(tasks);
});

app.patch('/tasks/:id/accept', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    task.status = 'accepted';
    io.emit('taskUpdated', task);
    io.emit('taskAccepted', task);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.patch('/tasks/:id/reject', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    task.status = 'rejected';
    io.emit('taskUpdated', task);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);
  io.emit('taskDeleted', taskId);
  res.status(204).send();
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
