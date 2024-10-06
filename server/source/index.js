require('dotenv').config();
const express = require('express');
const retryConnection = require('./database');
const app = express();
const machineIp = process.env.MACHINE_IP || 'localhost';

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

    // Import routes after database connection is ready
    const userRoutes = require('./routes/UserRoutes')(dbConnection);
    app.use('/user', userRoutes);

    app.listen(8080, () => {
      // console.log('Server running on http://localhost:8080');
      console.log('Server running on http://' + machineIp + ':8080');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();

module.exports = app;
