import { FcGoogle } from "react-icons/fc";

const OAuthButton = () => (
    <button
        type="button"
        className="flex items-center w-full justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-white transition"
    >
        <FcGoogle size={20} />
        Continue with Google
    </button>
);

export default OAuthButton;
