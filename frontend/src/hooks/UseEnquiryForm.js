import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showToast } from '../components/ui/Toast';
import { UserEnquiry } from '../api/authApi';


const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required').min(10, "Phone number should be atleat 10 digits").max(10, "Phone number must be only 10 digits")
}).required();

export default function useEnquiryForm() {

    const { register, handleSubmit, formState, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            phone: ''
        }
    })

    const onSubmit = async (data, setLoading) => {

        try {
            setLoading(true)

            const payload = {
                ...data
            }
            console.log(payload)
            // Call login API
            const response = await UserEnquiry(payload);

            if (!response?.data?.success) {
                showToast.error(response?.data?.message || 'Error in sending form')
                return
            }

            showToast.success('Enquiry form send successfuly');
            reset();

        } catch (err) {
            console.error('Form send error:', err)
            // Handle different error types
            if (err.response?.status === 401) {
                showToast.error('Error in sending form')
            }
        } finally {
            setLoading(false);
        }
    }
    return { register, handleSubmit, onSubmit, formState, watch };
}
