import { FcGoogle } from "react-icons/fc";

const OAuthButton = ({ role }) => {

    const handleGoogleLogin = () => {

        const stateData = {
            role,
            timestamp: Date.now()
        }

        const state = encodeURIComponent(JSON.stringify(stateData));

        // Redirect to backend OAuth endpoint
        window.location.href = `http://localhost:5000/api/oauth/google?state=${state}`
    }

    return (
        <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center w-full justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-white transition"
        >
            <FcGoogle size={20} />
            Continue with Google
        </button>
    )
}

export default OAuthButton;
