const express = require('express');
const router = express.Router();
const { 
  uploadVideo, 
  getMyVideos, 
  streamVideo, 
  deleteVideo 
} = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Route: POST /api/videos/upload
// Access: Editor and Admin only
router.post(
  '/upload', 
  protect, 
  authorize('editor', 'admin'), 
  upload.single('video'), 
  uploadVideo
);

// Route: GET /api/videos/my-videos
// Access: All logged in users (to see their own videos)
router.get('/my-videos', protect, getMyVideos);
// Route: GET /api/videos/stream/:id
// Access: Public (Browser needs direct access via <video src>)
router.get('/stream/:id', streamVideo);

// Route: DELETE /api/videos/:id
// Access: Private (Owner only)
router.delete('/:id', protect, deleteVideo);
module.exports = router;