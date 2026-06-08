import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { showToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { addNewDepartment, editDepartmentInfo } from '../api/adminApi';

// Yup Validation Schema
const departmentInfoSchema = yup.object().shape({

    //Add new Department Form field
    departmentName: yup
        .string()
        .trim()
        .min(3, "Display name must be at least 3 characters")
        .required("Department name is required"),

    status: yup
        .string()
        .required('Please select a status')
        .oneOf(['active', 'inactive'], 'Invalid status selection'),

    departmentDescription: yup
        .string()
        .trim()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must not exceed 500 characters')
})

export const useDepartmentForm = (initialData = null) => {

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
        resolver: yupResolver(departmentInfoSchema),
        mode: 'onChange',
        defaultValues: initialData || {
            departmentName: '',
            status: '',
            departmentDescription: ''
        }
    })

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);


    const onSubmit = async (data, fetchDepartments, setIsAddModalOpen, mode, department_id) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {

            let response;

            if (mode === "edit") {
                const departmentData = {
                    ...data,
                    id: department_id
                }
                response = await editDepartmentInfo(departmentData)
            } else {
                response = await addNewDepartment(data)
            }


            console.log("response", response?.data?.message)
            if (response?.data?.success === false) {
                showToast.error(response?.data?.message || 'Submission failed,Try again');
                setIsAddModalOpen(false)
                return;
            }

            // Do not navigate to dashboard

            if (mode === "edit") {
                showToast.success('Deaprtment edited successfully');
            } else {
                showToast.success('New department Added on to the List');
            }
            console.log("latestData", response.data.latestData)
            if (fetchDepartments) fetchDepartments();
            setIsAddModalOpen(false)

            reset();
            return

        } catch (error) {
            console.error('Submission error:', error)
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
