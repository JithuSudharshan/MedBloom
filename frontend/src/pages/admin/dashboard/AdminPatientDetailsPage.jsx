import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/landing page/Navbar";
import ProfileBanner from "../../../components/profile/ProfileBanner";
import AdminPatientDetails from "../../../components/profile/admin/patientProfile/AdminPatientDetails";

const AdminPatientDetailsPage = () => {
    const { patientId } = useParams();
    const navigate = useNavigate()
    console.log("patientId", patientId)
    return (
        <>
            <Navbar />
            <ProfileBanner profileOwner={"Admin Profile"} profileDescription={"Manage the patients information and records"} />
            <div className="min-h-screen max-w-7xl mx-auto w-full">
                <AdminPatientDetails patientId={patientId} onBack={() => navigate("/admin/dashboard")} />
            </div>
        </>
    )
};

export default AdminPatientDetailsPage