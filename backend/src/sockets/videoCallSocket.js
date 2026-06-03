import Appointment from '../model/appointmentModel.js';

const activeRooms = new Map(); // appointmentId -> { doctor: socketId, patient: socketId }

export const videoCallSocket = (io, socket) => {
    // Join a specific consultation room
    socket.on('join-consultation', async ({ appointmentId, userRole }) => {
        try {
            const appointment = await Appointment.findById(appointmentId);
            
            if (!appointment) {
                return socket.emit('call-error', { message: 'Appointment not found' });
            }

            if (appointment.status === 'cancelled' || appointment.status === 'completed') {
                return socket.emit('call-error', { message: `Consultation is ${appointment.status}` });
            }

            const parseTimeStr = (dateStr, timeStr) => {
                if (timeStr && timeStr.includes('T')) return new Date(timeStr.replace('Z', ''));
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
            socket.appointmentId = appointmentId;
            socket.userRole = userRole;

            let roomRoles = activeRooms.get(appointmentId) || {};
            roomRoles[userRole] = socket.id;
            activeRooms.set(appointmentId, roomRoles);

            // Notify others in the room that a user has joined
            socket.to(appointmentId).emit('user-joined', { socketId: socket.id, userRole });

            // If both doctor and patient are present, start the consultation
            if (roomRoles['doctor'] && roomRoles['patient']) {
                if (appointment.status !== 'in_progress') {
                    appointment.status = 'in_progress';
                    appointment.consultationStartedAt = new Date();
                    await appointment.save();
                }
                io.to(appointmentId).emit('consultation-started', { 
                    startedAt: appointment.consultationStartedAt || new Date() 
                });
            } else if (appointment.status === 'in_progress') {
                // If it's already in progress (e.g. reconnect), tell the connecting user it's started
                socket.emit('consultation-started', { 
                    startedAt: appointment.consultationStartedAt 
                });
            }

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
        
        let roomRoles = activeRooms.get(appointmentId);
        if (roomRoles && socket.userRole) {
            delete roomRoles[socket.userRole];
            if (Object.keys(roomRoles).length === 0) {
                activeRooms.delete(appointmentId);
            }
        }
        
        socket.to(appointmentId).emit('user-left', { socketId: socket.id });
    });

    // Handle disconnection specifically for video calls if needed
    socket.on('disconnect', () => {
        if (socket.appointmentId && socket.userRole) {
            let roomRoles = activeRooms.get(socket.appointmentId);
            if (roomRoles) {
                delete roomRoles[socket.userRole];
                if (Object.keys(roomRoles).length === 0) {
                    activeRooms.delete(socket.appointmentId);
                }
            }
            socket.to(socket.appointmentId).emit('user-left', { socketId: socket.id });
        }
    });
};
