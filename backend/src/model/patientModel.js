import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profile_url: {
        type: String,
        default: "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" // Profile picture storage URL or path
    },
    emergencyNumber: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['female', 'male', 'intersex', 'other'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        required: true
    },
    cholesterol: {
        type: String // Consider more specific type if you need numeric
    },
    height: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    bloodPressure: {
        type: String // Store as string like "120/80 mmHg"
    },
    glucoseLevel: {
        type: String
    },
    allergies: {
        type: String,
        default: ''
    },
    medicalCondition: {
        type: String,
        default: ''
    },
    smoking: {
        type: String,
        enum: [
            'Never smoked',
            'Former smoker',
            'Occasionally (social/rarely)',
            'Yes, daily',
            'Yes, but not daily'
        ],
        required: true
    },
    drinking: {
        type: String,
        enum: [
            'Never',
            'Quit drinking',
            'Occasionally (social/rarely)',
            'Yes, regularly',
            'Yes, but not regularly'
        ],
        required: true
    },
    Food_or_Drug_Intolerances: {
        type: String,
        default: ''
    },
    Mental_Health_History: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
