const fs = require('fs');
const csv = require('csv-parser');
const Redis = require('ioredis');
const path = require('path');

// FIX: Go up one level to find config
const config = require('../config'); 

// Conditional Redis Connection
let redis = null;
if (config.redis.enabled) {
  redis = new Redis({
    host: config.redis.host,
    port: config.redis.port
  });
}

let memoryBuffer = [];

// Resolve the CSV path correctly relative to the root
const csvPath = path.resolve(__dirname, '..', config.simulation.csvPath);

if (fs.existsSync(csvPath)) {
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => memoryBuffer.push(row))
    .on('end', () => console.log(`✅ CSV Loaded: ${memoryBuffer.length} rows.`));
} else {
  console.error(`❌ Error: ${csvPath} not found! Run 'node generate_ecg.js' first.`);
}

const startStream = (io) => {
  let index = 0;

  setInterval(() => {
    if (memoryBuffer.length === 0) return;

    const rawRow = memoryBuffer[index % memoryBuffer.length];
    
    const packet = {
      hr: parseInt(rawRow.HeartRate || 80),
      spo2: parseInt(rawRow.SpO2 || 98),
      value: parseFloat(rawRow.ECG_Value || 0),
      recordedAt: new Date()
    };

    // Emit to Frontend
    io.emit('ecg_data', packet);

    // Buffer to Redis (Only if enabled)
    if (redis) {
      redis.rpush('live_stream_buffer', JSON.stringify(packet));
    }

    index++;
  }, config.simulation.intervalMs); 
};

module.exports = { startStream };