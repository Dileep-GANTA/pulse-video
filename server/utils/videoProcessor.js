// server/utils/videoProcessor.js
const Video = require('../models/Video');

const processVideo = async (videoId, io) => {
  try {
    // 1. Find the video in the database
    const video = await Video.findById(videoId);
    if (!video) return;

    // 2. Mark as processing immediately
    video.status = 'processing';
    await video.save();

    console.log(`[AI Processor] Started analysis for: "${video.title}"`);

    // 3. Simulate Analysis Progress (Takes 5 seconds)
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 20;
      
      // Send real-time update to the dashboard
      io.emit('videoStatusUpdate', { 
        videoId, 
        status: 'processing', 
        progress 
      });

      // When analysis is complete (100%)
      if (progress >= 100) {
        clearInterval(interval);

        // --- THE NEW LOGIC STARTS HERE ---
        
        // List of words that trigger the AI flag
        const triggerWords = ['crime', 'virus', 'attack', 'hack', 'violence', 'danger', 'restricted', 'illegal'];
        
        // Convert title to lowercase and check if it includes any trigger word
        const titleLower = video.title.toLowerCase();
        const isSuspicious = triggerWords.some(word => titleLower.includes(word));

        // Determine Final Status
        const finalStatus = isSuspicious ? 'flagged' : 'safe';
        
        // ---------------------------------

        console.log(`[AI Processor] Analysis complete. Result: ${finalStatus.toUpperCase()}`);

        // Update Database
        video.status = finalStatus;
        video.progress = 100;
        await video.save();

        // Notify Frontend Final Result
        io.emit('videoStatusUpdate', { 
          videoId, 
          status: finalStatus, 
          progress: 100 
        });
      }
    }, 1000); // Progress increments every 1 second

  } catch (error) {
    console.error('Processing Error:', error);
  }
};

module.exports = processVideo;