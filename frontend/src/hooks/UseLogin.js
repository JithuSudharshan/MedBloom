import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../api/authApi';
import { showToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';


const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 chars').required('Password required')
}).required();

export default function useLogin() {

    const navigate = useNavigate()

    const { register, handleSubmit, formState, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data, selected, setLoading) => {

        try {
            setLoading(true)

            const payload = {
                ...data,
                selected
            }
            console.log(payload)
            // Call login API
            const response = await loginUser(payload);

            if (!response?.data?.success) {
                showToast.error(response?.data?.message || 'Login failed');
                return;
            }

            showToast.success('Login successful!');

            // Navigate based on role
            const userRole = response.data.user?.role || selected.toLowerCase();
            if (userRole === 'doctor') {
                navigate('/doctor/dashboard');
            } else {
                navigate('/patient/dashboard');
            }

            reset();

        } catch (err) {
            console.error('Login error:', err);

            // Handle different error types
            if (err.response?.status === 401) {
                showToast.error('Invalid email or password');
            } else if (err.response?.status === 403) {
                showToast.error(err.response.data.message || 'Account not verified');
                if (err.response.data.requiresVerification) {
                    navigate('/verify-email');
                }
            } else if (err.response?.status === 429) {
                showToast.error('Too many login attempts. Please try again later.');
            } else {
                showToast.error(err.response?.data?.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, onSubmit, formState, watch };
}
