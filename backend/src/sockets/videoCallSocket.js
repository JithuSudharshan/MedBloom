import Appointment from '../model/appointmentModel.js';

export const videoCallSocket = (io, socket) => {
    // Join a specific consultation room
    socket.on('join-consultation', async ({ appointmentId, userRole }) => {
        try {
            // Because appointmentId passed from frontend is the MongoDB _id (rawId), not the string 'appointmentId' property
            const appointment = await Appointment.findById(appointmentId);
            
            if (!appointment) {
                return socket.emit('call-error', { message: 'Appointment not found' });
            }

            if (appointment.status === 'cancelled' || appointment.status === 'completed') {
                return socket.emit('call-error', { message: `Consultation is ${appointment.status}` });
            }

            const parseTimeStr = (dateStr, timeStr) => {
                if (timeStr && timeStr.includes('T')) return new Date(timeStr);
                const d = new Date(`${dateStr}T${timeStr}`);
                if (!isNaN(d.getTime())) return d;
                return null;
            };

            const targetStartDate = parseTimeStr(appointment.date, appointment.startTime);
            let targetEndDate = appointment.endTime ? parseTimeStr(appointment.date, appointment.endTime) : null;
            
            if (targetStartDate && !targetEndDate) {
                targetEndDate = new Date(targetStartDate.getTime() + 30 * 60000);
            }

            if (!targetStartDate) {
                // If we can't parse time, fallback to allow joining for safety
                socket.join(appointmentId);
                socket.to(appointmentId).emit('user-joined', { socketId: socket.id, userRole });
                return;
            }

            const now = new Date();
            const timeDiff = targetStartDate.getTime() - now.getTime();
            const joinWindowOffset = 5 * 60000;

            if (targetEndDate && now.getTime() >= targetEndDate.getTime()) {
                return socket.emit('call-error', { message: 'Consultation has ended' });
            }

            if (timeDiff > joinWindowOffset) {
                return socket.emit('call-error', { message: 'Too early to join the consultation' });
            }

            socket.join(appointmentId);
            // Notify others in the room that a user has joined
            socket.to(appointmentId).emit('user-joined', { socketId: socket.id, userRole });
        } catch (error) {
            console.error("Socket Join Error:", error);
            socket.emit('call-error', { message: 'Server error while joining' });
        }
    });

    // WebRTC Signaling: Offer
    socket.on('offer', ({ appointmentId, offer }) => {
        socket.to(appointmentId).emit('offer', { offer, socketId: socket.id });
    });

    // WebRTC Signaling: Answer
    socket.on('answer', ({ appointmentId, answer }) => {
        socket.to(appointmentId).emit('answer', { answer, socketId: socket.id });
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('ice-candidate', ({ appointmentId, candidate }) => {
        socket.to(appointmentId).emit('ice-candidate', { candidate, socketId: socket.id });
    });

    // Leave Consultation
    socket.on('leave-consultation', ({ appointmentId }) => {
        socket.leave(appointmentId);
        socket.to(appointmentId).emit('user-left', { socketId: socket.id });
    });

    // Handle disconnection specifically for video calls if needed
    socket.on('disconnect', () => {
        // Since socket automatically leaves rooms, we might not need to do much here,
        // but 'user-left' could be handled by the client detecting disconnects
    });
};
