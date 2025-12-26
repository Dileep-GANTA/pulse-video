const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const http = require('http'); // Import HTTP
const { Server } = require('socket.io'); // Import Socket.io

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
})); // Enable CORS
// ... existing imports

// REPLACE app.use(helmet()); WITH THIS:
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ... rest of your code
app.use(morgan('dev')); // Logging
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Pulse Video App API is running...');
});

// Error Handling Middleware (Placeholder)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});




// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL, // Allow your Frontend
    methods: ["GET", "POST"]
  }
});

// 3. Make 'io' accessible in our controllers
app.set('socketio', io);

// 4. Socket Connection Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// ... Routes (keep existing)

const PORT = process.env.PORT || 5000;

// 5. CHANGE app.listen to server.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});