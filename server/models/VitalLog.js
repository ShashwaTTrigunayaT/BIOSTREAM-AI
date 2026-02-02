const mongoose = require('mongoose');

const VitalLogSchema = new mongoose.Schema({
  hr: Number,
  spo2: Number,
  ecgValue: Number, // Storing single points for simplicity in this demo
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VitalLog', VitalLogSchema);