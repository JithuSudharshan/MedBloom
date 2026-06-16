import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [
            'appointment_update', 
            'admin_approval', 
            'new_message', 
            'wallet_topup', 
            'wallet_deduction', 
            'appointment_booked', 
            'appointment_cancelled', 
            'appointment_rescheduled', 
            'video_reminder',
            'new_review',
            'system_alert',
            'contact_inquiry'
        ],
        required: true
    },

    link: {
        type: String
    },

    metadata: {
        enquiryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Enquiry',
            default: null
        }
    },

    read: {
        type: Boolean,
        default: false
    },

    timestamp: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model("Notification", notificationSchema);
