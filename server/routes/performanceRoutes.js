import express from 'express';
import Performance from '../models/Performance.js';
import { protect } from '../middleware/authMiddleware.js';
import mockStore from '../config/mockStore.js';

const router = express.Router();

// @desc    Get performance analytics
// @route   GET /api/performance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Mock Mode Check
    if (global.useMockDb) {
      const list = [...mockStore.performances];
      list.sort((a, b) => b.performancePercentage - a.performancePercentage);
      return res.json({ success: true, count: list.length, data: list });
    }

    const list = await Performance.find().sort({ performancePercentage: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error getting performance stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching performance stats' });
  }
});

export default router;
