require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const sosRoutes = require('./routes/sos.routes');
const initializeSocket = require('./sockets/sos.socket');

// Initialize App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect Database (MongoDB)
connectDB();

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);

// Initialize Socket.io Logic
initializeSocket(io);

// Start Server
const PORT = parseInt(process.env.PORT, 10) || 3000;
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Change the PORT in your .env or stop the process using it.`);
        process.exit(1);
    }
    throw error;
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
