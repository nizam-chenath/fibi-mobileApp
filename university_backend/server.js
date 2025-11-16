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

app.use(express.json({ 
  limit: '50mb'
}));
app.use(express.urlencoded({ 
  limit: '50mb',
  extended: true 
}));
app.use(cookieParser()); // Parse cookies
app.use(cors({
  origin: true, // Allow all origins
  credentials: true // Allow cookies to be sent
})); // Enable CORS for all routes

// Request timeout middleware
app.use((req, res, next) => {
  // Set a timeout for requests (30 seconds)
  req.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.status(408).json({ message: 'Request timeout' });
    }
  });
  next();
});

// Error handling middleware for body parsing (must be after body parsers)
app.use((err, req, res, next) => {
  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  
  if (err.name === 'BadRequestError' || (err.message && err.message.includes('aborted'))) {
    // Don't log or respond if request was already aborted and response sent
    if (!res.headersSent) {
      console.error('Request aborted:', err.message);
      return res.status(400).json({ message: 'Request was aborted. Please ensure you are using POST method with valid JSON body.' });
    }
    return;
  }
  
  next(err);
});

app.set('mysqlPool', mysqlPool);

// Register routes before starting server
const UserRoutes = require('./src/routes/userRoutes');
const ProposalRoutes = require('./src/routes/proposalRoutes');
const LoginRoutes = require('./src/routes/login');
const ServiceRequestRoutes = require('./src/routes/serviceRequestRoutes');
const EmailHubRoutes = require('./src/routes/emailHubRoutes');
const EmailHubMessageTypeRoutes = require('./src/routes/emailHubMessageTypeRoutes');
const DashboardOverviewRoutes = require('./src/routes/dashboardOverviewRoutes');

app.use('/api/users', UserRoutes);
app.use('/api/proposals', ProposalRoutes);
app.use('/api/login', LoginRoutes);
app.use('/api/service-requests', ServiceRequestRoutes);
app.use('/api/email-hub', EmailHubRoutes);
app.use('/api/message_types', EmailHubMessageTypeRoutes);
app.use('/api/dashboard-overview', DashboardOverviewRoutes);

// Start inbox cron job to check for new entries every 5 minutes
const { startInboxCronJob } = require('./src/services/inboxCronJob');
startInboxCronJob();

if (process.env.SSL_ENABLED === 'true') {
  const key = fs.readFileSync(process.env.SSL_KEY_PATH);
  const cert = fs.readFileSync(process.env.SSL_CERT_PATH);

  https.createServer({ key, cert }, app).listen(PORT_CONNECTION, () => {
    console.log(`Server running with SSL on port ${PORT_CONNECTION}`);
  });
} else {
  http.createServer(app).listen(PORT_CONNECTION, () => {
    console.log(`Server running without SSL on port ${PORT_CONNECTION}`);
  });
}
