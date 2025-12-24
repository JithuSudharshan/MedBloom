import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
            credentials: true
        },
    })

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(userId.toString())
        }
        socket.on('disconnect', () => { });
    });
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!')
    }
    return io
}
