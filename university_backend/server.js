const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT_CONNECTION = process.env.PORT_CONNECTION || 5000;
const mysqlPool = require('./src/db/mysql');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors()); // Enable CORS for all routes

app.set('mysqlPool', mysqlPool);

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

const UserRoutes = require('./src/routes/userRoutes');

app.use('/api/users', UserRoutes);
