const express = require('express');
const router = express.Router();
const { analyzeVitals, generateReport } = require('../controllers/aiController');

// Existing Route
router.post('/analyze', analyzeVitals);

// NEW Route for Reports
router.post('/report', generateReport);

module.exports = router;