const express = require('express');
const router = express.Router();
const { processCode, getHistory, deleteHistoryItem } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/process', protect, processCode);
router.get('/history', protect, getHistory);
router.delete('/history/:id', protect, deleteHistoryItem);

module.exports = router;
