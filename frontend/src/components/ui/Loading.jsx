import Lottie from "lottie-react";
import loaderPatient from "../../assets/animations/Loading.json";
import loaderDoctor from "../../assets/animations/LoadingDoctor.json";

const Loader = ({ role }) => {
    // Infer if it's the doctor side to match the burgundy theme
    const isDoctor = role === 'doctor' || (typeof window !== 'undefined' && window.location.pathname.includes('/doctor'));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div>
                <Lottie animationData={isDoctor ? loaderDoctor : loaderPatient} speed={1.5} loop />
            </div>
        </div>
    );
}

export default Loader;
