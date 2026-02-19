import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true,
        minLength: [3, 'Display name must be at least 3 characters']
    },
    departmentDescription: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minLength: [10, 'Description must be at least 10 characters'],
        maxLength: [500, 'Description must not exceed 500 characters']
    },
    status: {
        type: String,
        required: [true, 'Please select a status'],
        enum: {
            values: ['active', 'inactive'],
            message: 'Invalid status selection'
        },
        default: 'active'
    },
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Department = mongoose.model("Department", departmentSchema);

export default Department;
