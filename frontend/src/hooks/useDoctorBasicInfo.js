import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { showToast } from '../components/ui/Toast';
import { doctorbasicOnboarding } from '../api/doctorApi';
import { useNavigate } from 'react-router-dom';

// Yup Validation Schema
const doctorBasicInfoSchema = yup.object().shape({
    // Profile Picture
    profilePicture: yup
        .mixed()
        .nullable()
        .test("fileSize", "File size must be less than 5MB", (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
        })
        .test("fileType", "Only image files are allowed", (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
                value.type
            );
        }),

    // Basic Details
    contactNumber: yup
        .string()
        .required('Emergency contact is required')
        .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits'),

    dateOfBirth: yup.object().shape({
        month: yup.string().required("Month is required"),
        day: yup.string().required("Day is required"),
        year: yup.string().required("Year is required"),
    }),

    displayName: yup
        .string()
        .trim()
        .min(2, "Display name must be at least 2 characters")
        .required("Display name is required"),

    gender: yup
        .string()
        .required('Please select a gender')
        .oneOf(['female', 'male', 'intersex', 'other'], 'Invalid gender selection'),

    location: yup
        .string()
        .trim()
        .required('Location is required')
        .min(10, 'Location must be at least 10 characters')
        .max(500, 'Location must not exceed 500 characters'),


    shortBio: yup
        .string()
        .trim()
        .nullable()
        .max(800, 'Short bio must not exceed 800 characters')

})

export const useDoctorBasicInfo = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(doctorBasicInfoSchema),
        mode: 'onChange',
        defaultValues: {
            displayName: '',
            contactNumber: '',
            dateOfBirth: {
                month: '',
                day: '',
                year: '',
            },
            gender: '',
            location: '',
            shortBio: '',
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
            formData.append('contactNumber', data.contactNumber)
            formData.append('dateOfBirth', formattedDOB)
            formData.append('gender', data.gender)
            formData.append('location', data.location)
            formData.append('displayName', data.displayName)
            formData.append('shortBio', data.shortBio)

            // Append profile picture if exists
            if (data.profilePicture) {
                formData.append('profilePicture', data.profilePicture)
            }
            formData.get('profilePicture')

            console.log([...formData.entries()])

            const response = await doctorbasicOnboarding(formData)
            console.log(response)
            if (!response?.data?.success) {
                showToast.error(response?.data?.message || 'Submission failed,Try again');
                return;
            }

            navigate("/doctor/proffesional-onboarding")
            showToast.success('basic Onboarding successful!');

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
        control,
        errors,
        isValid,
        isDirty,
        isSubmitting,
        submitError,
    }
}
