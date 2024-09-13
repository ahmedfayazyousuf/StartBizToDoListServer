const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

let users = [];  // Users data
let tasks = [];  // Regular tasks
let taskRequests = []; // Task requests (from frontend)

const SECRET_KEY = 'your-secret-key';

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = user;
    next();
  });
};

// Admin Authentication Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).send('Admin access required');
  next();
};

// --- User Authentication (Login/Signup) ---

// POST /signup: Create a new user
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user already exists
  const userExists = users.find(user => user.email === email);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = {
    id: users.length + 1,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: 'user'  // Default role
  };

  users.push(user);
  res.status(201).json({ message: 'User created successfully' });
});

// POST /login: Authenticate user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(user => user.email === email);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY);
  res.json({ token });
});

// --- Task Management ---
// POST /tasks/request: Request to add a task
app.post('/tasks/request', authenticate, (req, res) => {
  const { firstName, lastName, email, phone, taskName, description, date } = req.body;
  
  const taskRequest = {
    id: taskRequests.length + 1,
    firstName,
    lastName,
    email,
    phone,
    taskName,
    description,
    date,
    status: 'pending'  // 'accepted', 'rejected', or 'pending'
  };
  
  taskRequests.push(taskRequest);
  res.status(201).json(taskRequest);
});

// GET /tasks/requests: Get all task requests (Admin access)
app.get('/tasks/requests', authenticate, isAdmin, (req, res) => {
  res.json(taskRequests);
});

// PUT /tasks/requests/:id: Update task request status (accept/reject)
app.put('/tasks/requests/:id', authenticate, isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const request = taskRequests.find(req => req.id === id);

  if (!request) return res.status(404).json({ message: 'Request not found' });

  const { status } = req.body;  // Accept or Reject
  request.status = status;

  if (status === 'accepted') {
    // Add to tasks if accepted
    tasks.push({
      id: tasks.length + 1,
      title: request.taskName,
      description: request.description,
      date: request.date,
      createdBy: `${request.firstName} ${request.lastName}`
    });
  }

  res.json(request);
});

// DELETE /tasks/requests/:id: Delete task request (Admin)
app.delete('/tasks/requests/:id', authenticate, isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  taskRequests = taskRequests.filter(request => request.id !== id);
  res.status(204).end();
});

// GET /tasks: Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
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
