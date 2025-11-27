import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { patientOnboarding } from '../api/patientApi';
import { showToast } from '../components/ui/Toast';

// Yup Validation Schema
const patientOnboardingSchema = yup.object().shape({
    // Profile Picture
    profilePicture: yup
        .mixed()
        .nullable()
        .test('fileSize', 'File size must be less than 5MB', (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
        })
        .test('fileType', 'Only image files are allowed', (value) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type);
        }),

    // Basic Details
    emergencyNumber: yup
        .string()
        .required('Emergency contact is required')
        .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits'),

    dateOfBirth: yup.object().shape({
        month: yup.string().required('Month is required'),
        day: yup.string().required('Day is required'),
        year: yup.string().required('Year is required'),
    }),

    gender: yup
        .string()
        .required('Please select a gender')
        .oneOf(['female', 'male', 'intersex', 'other'], 'Invalid gender selection'),

    address: yup
        .string()
        .required('Address is required')
        .min(10, 'Address must be at least 10 characters')
        .max(500, 'Address must not exceed 500 characters'),

    // Medical Information
    bloodType: yup
        .string()
        .required('Blood type is required')
        .oneOf(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], 'Invalid blood type'),

    cholesterol: yup
        .string()
        .nullable()
        .matches(/^\d+\/\d+\s*mmHg$|^$/, 'Format should be like: 120/80 mmHg'),

    height: yup
        .string()
        .nullable()
        .required('heigth is required')
        .matches(/^\d+(\.\d+)?\s*(cm|ft|in)?$|^$/, 'Format should be like: 180 cm'),

    weight: yup
        .string()
        .nullable()
        .required('Weigth type is required')
        .matches(/^\d+(\.\d+)?\s*(kg|lbs)?$|^$/, 'Format should be like: 65 Kg'),

    bloodPressure: yup
        .string()
        .nullable()
        .matches(/^\d+\/\d+\s*mmHg$|^$/, 'Format should be like: 120/80 mmHg'),

    glucoseLevel: yup
        .string()
        .nullable()
        .matches(/^\d+(\.\d+)?\s*(mg\/dL|mmol\/L)?$|^$/, 'Format should be like: 100 mg/dL'),

    allergies: yup
        .string()
        .nullable()
        .max(500, 'Allergies description must not exceed 500 characters'),

    medicalCondition: yup
        .string()
        .nullable()
        .max(500, 'Medical condition description must not exceed 500 characters'),

    smoking: yup
        .string()
        .required('Smoking status is required')
        .oneOf([
            'Never smoked',
            'Former smoker',
            'Occasionally (social/rarely)',
            'Yes, daily',
            'Yes, but not daily'
        ], 'Invalid option'),

    drinking: yup
        .string()
        .required('Drinking status is required')
        .oneOf([
            'Never',
            'Quit drinking',
            'Occasionally (social/rarely)',
            'Yes, regularly',
            'Yes, but not regularly'
        ], 'Invalid option'),

    Food_or_Drug_Intolerances: yup
        .string()
        .nullable()
        .max(500, 'Description must not exceed 500 characters'),

    Mental_Health_History: yup
        .string()
        .nullable()
        .max(500, 'Description must not exceed 500 characters'),

})

export const usePatientOnboarding = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(patientOnboardingSchema),
        mode: 'onChange',
        defaultValues: {

            fullName: '',
            email: '',
            emergencyNumber: '',
            dateOfBirth: {
                month: '',
                day: '',
                year: '',
            },
            gender: '',
            address: '',
            bloodType: '',
            cholesterol: '',
            height: '',
            weight: '',
            bloodPressure: '',
            glucoseLevel: '',
            allergies: '',
            medicalCondition: '',
            Food_or_Drug_Intolerances: '',
            smoking: '',
            drinking: '',
            Food_or_Drug_Intolerances: '',
            Mental_Health_History: '',
            profilePicture: null,
        },
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Format date of birth
            const formattedDOB = `${data.dateOfBirth.year}-${String(data.dateOfBirth.month).padStart(2, '0')}-${String(data.dateOfBirth.day).padStart(2, '0')}`;

            // Prepare form data for multipart/form-data submission
            const formData = new FormData();

            // Append all text fields
            formData.append('emergencyNumber', data.emergencyNumber)
            formData.append('dateOfBirth', formattedDOB)
            formData.append('gender', data.gender)
            formData.append('address', data.address)
            formData.append('bloodType', data.bloodType)
            formData.append('cholesterol', data.cholesterol || '')
            formData.append('height', data.height || '')
            formData.append('weight', data.weight || '')
            formData.append('bloodPressure', data.bloodPressure || '')
            formData.append('glucoseLevel', data.glucoseLevel || '')
            formData.append('allergies', data.allergies || '')
            formData.append('medicalCondition', data.medicalCondition || '')
            formData.append('smoking', data.smoking)
            formData.append('drinking', data.drinking)
            formData.append('Food_or_Drug_Intolerances', data.Food_or_Drug_Intolerances || '')
            formData.append('Mental_Health_History', data.Mental_Health_History || '')


            // Append profile picture if exists
            if (data.profilePicture) {
                formData.append('profilePicture', data.profilePicture)
            }
            formData.get('profilePicture')

            console.log([...formData.entries()])

            // API Call - Replace with your actual endpoint
            const response = await patientOnboarding(formData)
            console.log(response)
            if (!response?.data?.success) {
                showToast.error(res?.data?.message || 'Submission failed,Try again');
                return;
            }

            showToast.success('Onboarding successful!');

            // Reset form after successful submission
            reset();
            return
        } catch (error) {
            console.error('Onboarding error:', error)
            setSubmitError(error.message || 'An error occurred during submission')
            throw error;
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        register,
        handleSubmit,
        onSubmit,
        setValue,
        watch,
        reset,
        errors,
        isValid,
        isDirty,
        isSubmitting,
        submitError,
    }
}
