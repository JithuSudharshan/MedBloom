import Lottie from "lottie-react";
import loader from "../../assets/animations/Loading.json";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <Lottie animationData={loader} speed={1.5} loop />
        </div>
    );
}

export default Loader;
