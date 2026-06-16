import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { showToast } from "../components/ui/Toast";
import { doctorProfessionalOnboarding } from "../api/doctorApi";
import { useNavigate } from "react-router-dom";

// Yup Validation Schema for Professional Info
const doctorProfessionalInfoSchema = yup.object().shape({
    certificate: yup
        .mixed()
        .nullable()
        .required(" is required")
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
    yearOfExperience: yup
        .string()
        .oneOf(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"])
        .required("Year of experince  is required"),
    primarySpecialization: yup
        .string()
        .trim()
        .required("Primary specialization is required"),

    subSpecializations: yup
        .string()
        .trim()
        .nullable(),

    medicalRegistrationNumber: yup
        .string()
        .trim()
        .required("Medical registration number is required"),

    issuingCouncil: yup
        .string()
        .trim()
        .required("Issuing council is required"),

    licenseNumber: yup
        .string()
        .trim()
        .required("license Number is required"),

    clinicAddress: yup
        .string()
        .trim()
        .required("Clinic address is required"),

    consultationMode: yup
        .string()
        .oneOf(["online", "offline", "both"])
        .required("Consultation mode is required"),

    consultationFeesOnline: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value))
        .nullable()
        .typeError("Online fee must be a number")
        .min(0, "Online fee cannot be negative")
        .when("consultationMode", {
            is: (val) => val === "online" || val === "both",
            then: (schema) => schema.required("Online consultation fee is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    consultationFeesOffline: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value))
        .nullable()
        .typeError("Offline fee must be a number")
        .min(0, "Offline fee cannot be negative")
        .when("consultationMode", {
            is: (val) => val === "offline" || val === "both",
            then: (schema) => schema.required("Offline consultation fee is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export const useDoctorProfessionalInfo = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(doctorProfessionalInfoSchema),
        mode: "onChange",
        defaultValues: {
            certificate: null,
            primarySpecialization: "",
            subSpecializations: "",
            medicalRegistrationNumber: "",
            issuingCouncil: "",
            licenseNumber: "",
            clinicAddress: "",
            consultationMode: "",
            consultationFeesOnline: "",
            consultationFeesOffline: "",
            yearOfExperience: ""
        }
    });

    const onSubmit = async (data) => {

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Prepare form data for multipart/form-data submission
            const formData = new FormData();

            // Append all text fields
            formData.append('primarySpecialization', data.primarySpecialization)
            formData.append('subSpecializations', data.subSpecializations)
            formData.append('medicalRegistrationNumber', data.medicalRegistrationNumber)
            formData.append('issuingCouncil', data.issuingCouncil)
            formData.append('licenseNumber', data.licenseNumber)
            formData.append('clinicAddress', data.clinicAddress)
            formData.append('consultationMode', data.consultationMode)
            formData.append('consultationFeesOnline', data.consultationFeesOnline)
            formData.append('consultationFeesOffline', data.consultationFeesOffline)
            formData.append('yearOfExperience', data.yearOfExperience)

            // Append profile picture if exists
            if (data.certificate) {
                formData.append('certificate', data.certificate)
            }
            formData.get('certificate')

            console.log([...formData.entries()])

            console.log("Professional payload:", formData);

            const response = await doctorProfessionalOnboarding(formData);
            if (!response?.data?.success) {
                showToast.error(
                    response?.data?.message || "Submission failed, try again"
                );
                return;
            }

            showToast.success("Professional info saved!");
            navigate("/doctor/dashboard");

            reset();
            return;
        } catch (error) {
            console.error("Professional onboarding error:", error);
            setSubmitError(
                error?.message || "An error occurred during submission"
            );
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

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
        submitError
    };
};
