import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userChangePassword } from '../api/authApi';


const schema = yup.object({
    currentPassword: yup
        .string()
        .min(8, 'Password must be at least 8 chars')
        .required('Password required'),

    newPassword: yup
        .string()
        .min(8, 'Password must be at least 8 chars')
        .required('Password required')
        .test(
            'not-same-as-current',
            'New password must be different from current password',
            function (value) {
                const { currentPassword } = this.parent;
                if (!value || !currentPassword) return true;
                return value !== currentPassword;
            }
        ),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password required'),
}).required();


export default function useEnquiryForm() {

    const navigate = useNavigate();
    const { logout } = useAuth()

    const { register, handleSubmit, formState, reset, watch } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (data, setLoading) => {

        try {
            setLoading(true)

            const payload = {
                ...data
            }
            console.log(payload)

            const response = await userChangePassword(payload);

            if (response) {
                try {
                    reset()
                    const res = await logout();
                    console.log(res)
                    if (!res?.data?.success) {
                        showToast.error(res.data.message);
                    }
                    navigate("/login");
                    showToast.success("Password changed. Please log in again.");
                } catch (error) {
                    showToast.error("Something went wrong here");
                    console.log(error);
                }
            }

        } catch (err) {
            console.error('Form send error:', err)

            if (err.response?.data?.message) {
                showToast.error(err.response.data.message);
            } else {
                showToast.error('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    }
    return { register, handleSubmit, onSubmit, formState, watch };
}
