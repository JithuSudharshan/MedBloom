import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signupUser } from '../api/authApi';
import { showToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';


//Schema validation using yup
const schema = yup.object({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required').min(10, "Phone number should be atleat 10 digits").max(10, "Phone number must be only 10 digits"),
    password: yup.string().min(6, 'Password must be at least 6 chars').required('Password required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password required')
}).required();


export default function useSignup() {

    const navigate = useNavigate();


    const { register, handleSubmit, formState, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        },
    });


    const onSubmit = useCallback(async (data, selected) => {
        try {

            const payload = {
                ...data,
                role: selected?.toLowerCase()
            }

            const res = await signupUser(payload)

            if (!res?.data?.success) {
                console.log(res?.data?.data);
                return showToast.error(res?.data?.message);
            }
            const email = data.email;
            navigate("/verify/email/link", { state: { email } })
            showToast.success(res?.data?.message)



            reset();
        } catch (err) {

            console.error(err);
            if (err.response?.data?.message) {
                showToast.error(err.response.data.message);
            } else {
                showToast.error("Unexpected Error:", err.message);
            }

        }
    }, [reset]);

    return { register, handleSubmit, onSubmit, formState, watch };
}
