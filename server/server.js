const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const config = require('./config'); // Looks in same folder
const aiRoutes = require('./routes/api');
const { startStream } = require('./services/streamService'); // Looks in services folder

const app = express();

// Middleware
app.use(cors({ origin: config.server.corsOrigin }));
app.use(express.json());

// Server & Socket Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: config.server.corsOrigin, 
    methods: ["GET", "POST"] 
  }
});

// Routes
app.use('/api', aiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('BioStream Server is Running...');
});

// Start Data Stream
console.log(`❤️  Initializing ECG Stream from: ${config.simulation.csvPath}`);
startStream(io);

// Launch
server.listen(config.server.port, () => {
  console.log(`\n🚀 SERVER STARTED`);
  console.log(`   - Port: ${config.server.port}`);
  console.log(`   - AI Model: ${config.ai.apiKey ? 'Active' : 'Disabled (No Key)'}`);
});