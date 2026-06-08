import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/landing page/Navbar";
import AdminDoctorDetails from "../../../components/profile/admin/doctorProfile/AdminDoctorDetails";

const AdminDoctorDetailsPage = () => {
    const { DoctorId } = useParams();
    const navigate = useNavigate()
    console.log("doctor id as param", DoctorId)
    return (
        <>
            <Navbar />
            <div className="min-h-screen mt-15 mb-15 max-w-7xl mx-auto w-full">
                <AdminDoctorDetails
                    doctorId={DoctorId}
                    onBack={() => navigate("/admin/dashboard")}
                />
            </div>

        </>
    )
};
export default AdminDoctorDetailsPage   