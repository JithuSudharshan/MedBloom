import LeftHero from "../components/layout/LeftHero";
import AuthCard from "../components/layout/AuthCard";
import heroImg from "../assets/hero-illustration.png";

const SignUp = () => {
    return (
        <div className="flex h-screen">
            <LeftHero imgSrc={heroImg} sentence={"Create an account to book appointments, access medical records, and connect with healthcare professionals."} />
            <AuthCard oneLine={"Join us! Sign up as a Doctor or Patient."} />
        </div>
    );
};

export default SignUp;
