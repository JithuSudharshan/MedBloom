import { Server } from 'socket.io';
import { videoCallSocket } from '../sockets/videoCallSocket.js';
import { ENV } from '../config/env.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [ENV.FRONTEND_URL],
            credentials: true
        },
    })

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(userId.toString())
        }
        
        // Initialize video call socket handlers
        videoCallSocket(io, socket);

        socket.on('disconnect', () => { });
    });
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!')
    }
    return io
}
