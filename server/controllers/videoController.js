const Video = require('../models/Video');
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Re-initialize S3 Client (or export it from a config file to reuse)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// @desc    Upload Video (S3)
// @route   POST /api/videos/upload
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // S3 adds a 'location' and 'key' to req.file
    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      filename: req.file.key, // Save the S3 Key (e.g., videos/123.mp4)
      fileUrl: req.file.location, // S3 Public URL (optional usage)
      uploader: req.user._id,
      status: 'uploaded'
    });

    res.status(201).json({ success: true, data: video });

    // Trigger Processing (Simulated)
    const io = req.app.get('socketio');
    const processVideo = require('../utils/videoProcessor');
    processVideo(video._id, io);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Stream Video (S3 Proxy)
// @route   GET /api/videos/stream/:id
// ... imports (S3Client, GetObjectCommand, Video model)

const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    console.log("--- DEBUG STREAM ---");
    console.log("Video ID:", req.params.id);
    console.log("Video Object from DB:", video);
    console.log("Filename we are trying:", video.filename);
    console.log("--------------------");
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // 1. Get the Range Header from the browser
    const range = req.headers.range;
    
    // 2. Prepare S3 Parameters
    const commandParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: video.filename,
    };

    // 3. If Range exists, tell S3 we only want that part
    if (range) {
      commandParams.Range = range;
    }

    const command = new GetObjectCommand(commandParams);
    const response = await s3.send(command);

    // 4. Set Headers exactly as S3 sends them
    // This includes Content-Range, Content-Length, and Content-Type
    res.set({
      'Content-Range': response.ContentRange,
      'Accept-Ranges': 'bytes',
      'Content-Length': response.ContentLength,
      'Content-Type': response.ContentType || 'video/mp4',
    });

    // 5. Send correct status code
    // If we asked for a range, S3 returns a range, so we send 206.
    // Otherwise, we send 200.
    const statusCode = range ? 206 : 200;
    res.status(statusCode);

    // 6. Pipe the stream
    if (response.Body) {
      response.Body.pipe(res);
    } else {
      console.error("S3 Response missing Body");
      res.status(500).end();
    }

  } catch (error) {
    console.error('S3 Stream Error:', error);
    // Don't send JSON if headers are already sent
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error streaming video' });
    }
  }
};
// @desc    Delete Video (S3)
// @route   DELETE /api/videos/:id
// @desc    Delete Video (S3)
// @route   DELETE /api/videos/:id
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    // 1. Check if video exists
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // --- FIX START: ROBUST OWNERSHIP CHECK ---
    // We check if 'video.uploader' actually exists.
    if (video.uploader) {
       // If video has an owner, check if it matches the current user (or if user is admin)
       if (video.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(401).json({ message: 'Not authorized' });
       }
    } else {
       // If video has NO owner (Zombie Video), ONLY allow Admin to delete it
       // This prevents the "undefined" crash
       if (req.user.role !== 'admin') {
         return res.status(401).json({ message: 'Not authorized (Video has no owner)' });
       }
    }
    // --- FIX END ---

    // 2. Delete from S3 (Safely)
    // We check both 'filename' and 'key' because different versions of code might have saved it differently
    const fileKey = video.filename || video.key;
    
    if (fileKey) {
      try {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey
        };
        await s3.send(new DeleteObjectCommand(deleteParams));
      } catch (s3Err) {
        console.error("S3 Delete Warning (File might be already gone):", s3Err.message);
        // We continue deleting from DB even if S3 fails
      }
    }

    // 3. Delete from Database
    await video.deleteOne();
    
    res.json({ message: 'Video removed' });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Keep getMyVideos as is...
const getMyVideos = async (req, res) => {
  /* ... same as before ... */ 
  const videos = await Video.find({ uploader: req.user._id }).sort({ createdAt: -1 });
  res.json(videos);
};



// @desc    Update Video Details
// @route   PUT /api/videos/:id
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    // 1. Check if video exists
    if (!video) return res.status(404).json({ message: "Video not found" });

    // 2. Check Ownership (Security)
    // We compare the video uploader to the current logged-in user
    if (video.uploader && video.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can update only your video!" });
    }

    // 3. Update the fields
    // We only update if the user sent new data. Otherwise, keep old data.
    if (req.body.title) video.title = req.body.title;
    if (req.body.desc) video.desc = req.body.desc; // Assuming field is named 'desc' or 'description'
    // if (req.body.imgUrl) video.imgUrl = req.body.imgUrl; // Optional: Update thumbnail

    // 4. Save to DB
    const updatedVideo = await video.save();
    
    res.status(200).json(updatedVideo);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = { uploadVideo, streamVideo, deleteVideo, getMyVideos, updateVideo };