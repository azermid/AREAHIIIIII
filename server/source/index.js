require('dotenv').config();
const express = require('express');
const retryConnection = require('./database');
const { startOutlookPollingWorker } = require('./worker/OutlookWorker');
const { startSpotifyPollingWorker } = require('./worker/SpotifyWorker');

const app = express();

const backendUri = process.env.BACKEND_URI || 'http://localhost:8080';

app.use(express.json());

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

    startOutlookPollingWorker(60000, dbConnection);
    startSpotifyPollingWorker(30000, dbConnection);

    // app.use((req, res, next) => {
    //   console.log('Headers:', req.headers);
    //   console.log('Body:', req.body);
    //   next();
    // });

    const aboutRoutes = require('./routes/AboutRoutes')(dbConnection);
    app.use('/', aboutRoutes);

    const userRoutes = require('./routes/UserRoutes')(dbConnection);
    app.use('/user', userRoutes);

    const apkRoutes = require('./routes/ApkRoute')(dbConnection);
    app.use('/', apkRoutes);

    const workspaceRoutes = require('./routes/WorkspaceRoutes')(dbConnection);
    app.use('/workspace', workspaceRoutes);

    const serviceRoutes = require('./routes/ServiceRoutes')(dbConnection);
    app.use('/service', serviceRoutes);

    const actionRoutes = require('./routes/ActionRoutes')(dbConnection);
    app.use('/action', actionRoutes);

    const reactionRoutes = require('./routes/ReactionRoutes')(dbConnection);
    app.use('/reaction', reactionRoutes);

    const triggerRoutes = require('./routes/TriggerRoutes')(dbConnection);
    app.use('/trigger', triggerRoutes);

    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    const webhookRoutes = require('./routes/WebhookRoutes')(dbConnection);
    app.use('/webhook', webhookRoutes);

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
