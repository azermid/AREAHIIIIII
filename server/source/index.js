require('dotenv').config();
const express = require('express');
const retryConnection = require('./database');
const app = express();

const backendUri = process.env.BACKEND_URI || 'http://localhost:8080';

app.use(express.json());

// app.use((req, res, next) => {
//   console.log('Incoming Request:', req.method, req.url, req.headers);
//   next();
// });

app.use((req, res, next) => {
  const allowedOrigin = 'http://localhost:8081';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

(async () => {
  try {
    const dbConnection = await retryConnection();
    console.log('Database connection established');

    // app.use((req, res, next) => {
    //   console.log('Headers:', req.headers);
    //   console.log('Body:', req.body);
    //   next();
    // });
    
    const userRoutes = require('./routes/UserRoutes')(dbConnection);
    app.use('/user', userRoutes);

    const workspaceRoutes = require('./routes/WorkspaceRoutes')(dbConnection);
    app.use('/workspace', workspaceRoutes);

    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

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
