const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT_CONNECTION = process.env.PORT_CONNECTION || 5000;
const mysqlPool = require('./src/db/mysql');
const authenticateToken = require('./src/middleware/authenticate');
const { initializeSocket } = require('./src/utils/socket');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cookieParser()); // Parse cookies
app.use(cors({
  origin: true, // Allow all origins
  credentials: true // Allow cookies to be sent
})); // Enable CORS for all routes

app.set('mysqlPool', mysqlPool);

// Create HTTP/HTTPS server
let server;
if (process.env.SSL_ENABLED === 'true') {
  const key = fs.readFileSync(process.env.SSL_KEY_PATH);
  const cert = fs.readFileSync(process.env.SSL_CERT_PATH);

  server = https.createServer({ key, cert }, app);
  server.listen(PORT_CONNECTION, () => {
    console.log(`Server running with SSL on port ${PORT_CONNECTION}`);
  });
} else {
  server = http.createServer(app);
  server.listen(PORT_CONNECTION, () => {
    console.log(`Server running without SSL on port ${PORT_CONNECTION}`);
  });
}

// Initialize Socket.IO
initializeSocket(server);

const loginRoute = require('./src/routes/login');
const logoutRoute = require('./src/routes/logout');
const userDetailsRoute = require('./src/routes/userDetails');
const allUsersRoute = require('./src/routes/allUsers');
const updateRoute = require('./src/routes/update');
const deleteRoute = require('./src/routes/delete');
const universitiesRoute = require('./src/routes/universities');
const proposalRoutes = require('./src/routes/proposalRoutes');
const serviceRequestRoutes = require('./src/routes/serviceRequestRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const emailHubRoutes = require('./src/routes/emailHubRoutes');

app.use('/api/login', loginRoute);
app.use('/api/logout', logoutRoute);
app.use('/api/user-details', authenticateToken, userDetailsRoute);
app.use('/api/all-users', authenticateToken, allUsersRoute);
app.use('/api/update-user', authenticateToken, updateRoute);
app.use('/api/delete-user', authenticateToken, deleteRoute);
app.use('/api/universities', universitiesRoute);
app.use('/api/proposals', authenticateToken, proposalRoutes);
app.use('/api/service-requests', authenticateToken, serviceRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/email-hub', authenticateToken, emailHubRoutes);

