const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.IO server
 * @param {http.Server|https.Server} server - HTTP/HTTPS server instance
 * @returns {Server} - Socket.IO server instance
 */
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: true, // Allow all origins
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  // Handle connection
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Handle join room request
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room: ${roomId}`);
    });

    // Handle leave room request
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      console.log(`Client ${socket.id} left room: ${roomId}`);
    });
  });

  console.log('Socket.IO server initialized');
  return io;
}

/**
 * Send message to a specific room
 * @param {string} roomId - Room ID to send message to
 * @param {string} event - Event name
 * @param {object} data - Data to send
 */
function sendToRoom(roomId, event, data) {
  if (!io) {
    console.error('Socket.IO not initialized');
    return false;
  }

  try {
    io.to(roomId).emit(event, data);
    console.log(`Message sent to room ${roomId} with event ${event}`);
    return true;
  } catch (error) {
    console.error('Error sending message to room:', error);
    return false;
  }
}

/**
 * Send message to all connected clients
 * @param {string} event - Event name
 * @param {object} data - Data to send
 */
function broadcast(event, data) {
  if (!io) {
    console.error('Socket.IO not initialized');
    return false;
  }

  try {
    io.emit(event, data);
    console.log(`Broadcast message sent with event ${event}`);
    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}

/**
 * Get Socket.IO instance
 * @returns {Server|null} - Socket.IO server instance or null if not initialized
 */
function getIO() {
  return io;
}

module.exports = {
  initializeSocket,
  sendToRoom,
  broadcast,
  getIO
};

