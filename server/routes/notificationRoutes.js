import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';
import mockStore from '../config/mockStore.js';

const router = express.Router();

// @desc    Get all notifications for the BDA
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Mock Mode Check
    if (global.useMockDb) {
      let filtered = mockStore.notifications.filter(n => 
        !n.recipient || n.recipient.toString() === req.user._id.toString()
      );
      
      // Sort by newest
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: filtered.length, data: filtered.slice(0, 30) });
    }

    const list = await Notification.find({
      $or: [
        { recipient: req.user._id },
        { recipient: null }
      ]
    }).sort({ createdAt: -1 }).limit(30);
    
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notifications' });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    // Mock Mode Check
    if (global.useMockDb) {
      const index = mockStore.notifications.findIndex(n => n._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }

      mockStore.notifications[index].read = true;
      return res.json({ success: true, data: mockStore.notifications[index] });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, message: 'Server error updating notification' });
  }
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    // Mock Mode Check
    if (global.useMockDb) {
      mockStore.notifications.forEach(n => {
        if (n.recipient && n.recipient.toString() === req.user._id.toString()) {
          n.read = true;
        }
      });
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error updating all notifications:', error);
    res.status(500).json({ success: false, message: 'Server error updating notifications' });
  }
});

export default router;
