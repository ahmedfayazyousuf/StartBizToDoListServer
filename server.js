// import { componentLoader, Components } from './admin/components.js';
// import AdminJS from 'adminjs';
// import AdminJSExpress from '@adminjs/express';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://startbiztodolistclient.vercel.app",
  "https://startbiztodolistclient-c3td5r44i-ahmed-fayaz-yousufs-projects.vercel.app",
  "https://startbiztodolistclient-git-master-ahmed-fayaz-yousufs-projects.vercel.app",
  "http://localhost:3000"
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

// const admin = new AdminJS({
//   resources: [],
//   rootPath: '/admin',
//   componentLoader: componentLoader,
//   dashboard: {
//     component: Components.Dashboard,
//   },
// });

// const adminRouter = AdminJSExpress.buildRouter(admin);
// app.use(admin.options.rootPath, adminRouter);

let tasks = [];

app.post('/tasks', (req, res) => {
  const { title, description, firstName, lastName, email, phone, date } = req.body;

  const newTask = {
    id: uuidv4(),
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
  res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
  const acceptedTasks = tasks.filter(task => task.status === 'accepted');
  res.json(acceptedTasks);
});

app.get('/admin/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/admin/tasks/stats', (req, res) => {
  const stats = {
    total: tasks.length,
    accepted: tasks.filter(task => task.status === 'accepted').length,
    rejected: tasks.filter(task => task.status === 'rejected').length,
    pending: tasks.filter(task => task.status === 'pending').length,
  };
  res.json(stats);
});

app.patch('/tasks/:id/accept', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    task.status = 'accepted';
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.patch('/tasks/:id/reject', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    task.status = 'rejected';
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.patch('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    Object.assign(task, req.body);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  tasks = tasks.filter(task => task.id !== taskId);
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(`AdminJS started on http://localhost:${PORT}/admin`);
});