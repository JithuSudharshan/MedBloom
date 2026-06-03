import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        isDigital: {
            type: Boolean,
            default: false
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment'
        },
        category: {
            type: String,
            enum: ['lab', 'imaging', 'prescription', 'other'],
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        fileUrl: {
            type: String,
            required: function() { return !this.isDigital; }
        },
        fileType: {
            type: String,
            required: function() { return !this.isDigital; }
        },
        fileSize: {
            type: Number,
            required: function() { return !this.isDigital; }
        },
    },
    { timestamps: true }
);

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
