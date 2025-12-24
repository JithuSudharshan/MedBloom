import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { showToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { editDoctorProfile } from '../api/doctorApi';
import { adminEditsDoctorProfile } from '../api/adminApi';

// Yup Validation Schema
const doctorEditingSchema = yup.object().shape({

    // Doctor Details

    displayName: yup
        .string()
        .trim()
        .max(80, "Display name must be at most 80 characters")
        .nullable()
        .notRequired(),

    contactNumber: yup
        .string()
        .trim()
        .nullable()
        .matches(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number")
        .required(),

    gender: yup
        .string()
        .oneOf(["male", "female", "other", ""], "Invalid gender")
        .notRequired(),

    location: yup
        .string()
        .trim()
        .nullable()
        .notRequired(),

    shortBio: yup
        .string()
        .trim()
        .max(600, "Short bio must be at most 600 characters")
        .nullable()
        .notRequired(),

    consultationMode: yup
        .string()
        .oneOf(["online", "offline", "both"], "Invalid consultation mode")
        .required("Consultation mode is required"),

    consultationFeesOnline: yup
        .number()
        .typeError("Online fee must be a number")
        .min(0, "Online fee cannot be negative")
        .when("consultationMode", {
            is: (val) => val === "online" || val === "both",
            then: (schema) => schema.required("Online consultation fee is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    consultationFeesOffline: yup
        .number()
        .typeError("Offline fee must be a number")
        .min(0, "Offline fee cannot be negative")
        .when("consultationMode", {
            is: (val) => val === "offline" || val === "both",
            then: (schema) => schema.required("Offline consultation fee is required"),
            otherwise: (schema) => schema.notRequired(),
        })

})

export const useEditDoctorProfile = (initialDoctor, { isAdmin = false, doctorId }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const navigate = useNavigate();

    const buildDefaults = (p) => {

        return {
            displayName: p?.displayName || "",
            contactNumber: p?.phone || "",
            gender: p?.gender || "",
            location: p?.address || "",
            shortBio: p?.shortBio || "",
            consultationMode: p?.consultationMode || "",
            consultationFeesOnline: p?.consultationFeesOnline || "",
            consultationFeesOffline: p?.consultationFeesOffline || ""
        }
    }

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(doctorEditingSchema),
        mode: 'onChange',
        defaultValues: buildDefaults(initialDoctor)
    })

    useEffect(() => {
        if (initialDoctor) {
            reset(buildDefaults(initialDoctor));
        }
    }, [initialDoctor, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const formData = new FormData();

            // Append all text fields
            formData.append('displayName', data.displayName)
            formData.append('contactNumber', data.contactNumber)
            formData.append('gender', data.gender)
            formData.append('location', data.location)
            formData.append('shortBio', data.shortBio || '')
            formData.append('consultationMode', data.consultationMode || '')
            formData.append('consultationFeesOnline', data.consultationFeesOnline || '')
            formData.append('consultationFeesOffline', data.consultationFeesOffline || '')

            console.log("Entered Value", [...formData.entries()])

            const response = isAdmin ?
                await adminEditsDoctorProfile(formData, doctorId) :
                await editDoctorProfile(formData)

            console.log(response)
            if (!response?.data?.success) {
                showToast.error(response?.data?.message || 'Submission failed,Try again');
                return;
            }

            isAdmin ?
                navigate('/admin/dashboard')
                :
                navigate('/doctor/dashboard')

            showToast.success('Porfile edit Updated');
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
