require('dotenv').config();
const express = require('express');
const retryConnection = require('./database');
const app = express();
const backendUri = process.env.BACKEND_URI || 'http://localhost:8080';

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

(async () => {
  try {
    const dbConnection = await retryConnection();
    console.log('Database connection established');

    //user routes
    const userRoutes = require('./routes/UserRoutes')(dbConnection);
    app.use('/user', userRoutes);

    const workspaceRoutes = require('./routes/WorkspaceRoutes')(dbConnection);
    app.use('/workspace', workspaceRoutes);

    const authRoutes = require('./routes/AuthRoutes')(dbConnection);
    app.use('/auth', authRoutes);

    app.listen(8080, () => {
      console.log('Server running on: ' + backendUri);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();

module.exports = app;
