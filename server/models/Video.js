// server/models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  
  // S3 'Key' (path in bucket)
  filename: { type: String, required: true },
  
  // Optional: Store full URL if you want
  fileUrl: { type: String }, 
  
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'uploaded' },
  videoDuration: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);