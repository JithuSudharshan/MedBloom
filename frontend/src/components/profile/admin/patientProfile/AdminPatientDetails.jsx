import { useEffect, useState } from "react";
import PatientInformation from "../../PatientInformation";
import { showToast } from "../../../ui/Toast";
import ConsultationHistoryTable from "../doctorProfile/ConsultationHistoryTable"; // or a patient variant
import UpcomingAppointments from "../doctorProfile/UpcomingAppointments"; // reuse if generic
import { loadPatientForAdmin } from "../../../../api/adminApi";
import Loader from "../../../ui/Loading";

const AdminPatientDetails = ({ patientId, onBack }) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!patientId) return null;
    console.log(patientId)

    const fetchPatientDetails = async (id) => {
        try {
            setLoading(true);
            const res = await loadPatientForAdmin(id);

            if (!res.data?.success) {
                showToast.error(res.data?.message || "Something went wrong");
                return;
            }

            setPatient(res.data.details);
        } catch (error) {
            console.error("Error loading patient details:", error);
            showToast.error("Something went wrong while loading patient details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientDetails(patientId);
    }, [patientId]);

    if (loading || !patient) {
        return (
            <Loader />
        );
    }

    return (
        <div className="bg-white rounded-2xl mt-20 shadow-xl border border-teal-200 px-10 py-8 space-y-8">
            {/* Header: back + avatar + edit */}
            <div className="flex items-start justify-between mb-6">
                <button
                    onClick={onBack}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                    ← Back
                </button>

                <div className="flex flex-col items-center flex-1">
                    <div className="h-34 w-34 rounded-full overflow-hidden border-4 border-teal-100 mb-3">
                        <img
                            src={patient.avatar?.src || patient.profilePicture}
                            alt={patient.fullName}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <div className="w-20" />
            </div>

            {/* Basic + medical info */}
            <section className="border-t border-slate-200 pt-6">
                <PatientInformation patient={patient} showActions={false} isAdmin={true} />
            </section>

            {/* Consultation history */}
            <section className="border border-slate-200 rounded-xl mt-4">
                <ConsultationHistoryTable patientId={patient._id} />
            </section>

            {/* Upcoming appointments */}
            <section className="border border-slate-200 rounded-xl mt-4">
                <UpcomingAppointments patientId={patient._id} />
            </section>
        </div>
    );
};

export default AdminPatientDetails;
