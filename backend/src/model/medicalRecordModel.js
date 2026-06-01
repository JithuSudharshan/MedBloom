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
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
