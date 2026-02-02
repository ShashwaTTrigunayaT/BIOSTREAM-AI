const mongoose = require('mongoose');

const EcgDataSchema = new mongoose.Schema({
  
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  
  
  batchId: { 
    type: String, 
    required: true 
  },

  
  readings: [
    {
      hr: Number,       
      spo2: Number,     
      value: Number,    
      recordedAt: Date  
    }
  ]
});


EcgDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model('EcgData', EcgDataSchema);