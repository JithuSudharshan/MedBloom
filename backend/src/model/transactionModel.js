import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        required: true,
        enum: ['Patient', 'Doctor']
    },
    type: {
        type: String,
        required: true,
        enum: ['credit', 'debit']
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Success', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    description: {
        type: String,
        required: true
    },
    paymentGateway: {
        type: String,
        enum: ['razorpay', 'system'],
        default: 'system'
    },
    paymentId: {
        type: String, // Razorpay Payment ID or Order ID
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

// Create index for efficient querying by user
transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
