const https = require('https');
const fs = require('fs');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const certPath = './localhost.pem';
const keyPath = './localhost-key.pem';

// Check if the certificate and key files exist
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error('Files not found. Please generate an SSL certificate for localhost and place it in the cert directory of the project.');
  process.exit(1);
}

const app = express();

// Configura il proxy
app.use('/', createProxyMiddleware({
  target: 'http://localhost:8081',
  changeOrigin: true,
  secure: false,
  ws: true
}));

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const server = https.createServer(options, app);
server.listen(19006, () => {
  console.log('Secure server on https://localhost:19006');
});