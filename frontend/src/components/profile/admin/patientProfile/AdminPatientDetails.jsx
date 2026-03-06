import { useEffect, useState } from "react";
import PatientInformation from "../../PatientInformation";
import { showToast } from "../../../ui/Toast";
import ConsultationHistoryTable from "../doctorProfile/ConsultationHistoryTable";
import UpcomingAppointments from "../doctorProfile/UpcomingAppointments";
import { loadPatientForAdmin } from "../../../../api/adminApi";
import Loader from "../../../ui/Loading";
import Modal from "../../Modal";
import AvatarCropper from "../../AvatarCropper";

const AdminPatientDetails = ({ patientId, onBack }) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    const fetchPatientDetails = async () => {
        try {
            setLoading(true);

            const res = await loadPatientForAdmin(patientId);

            if (!res.data?.success) {
                showToast.error(res.data?.message || "Failed to load patient");
                return;
            }

            setPatient(res.data.details);
        } catch (error) {
            console.error("Error loading patient:", error);
            showToast.error("Something went wrong while loading details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchPatientDetails();
    }, [patientId]);

    const handleAvatarSaved = (newAvatarUrl) => {
        setPatient((prev) => ({
            ...prev,
            avatar: { ...(prev?.avatar || {}), src: newAvatarUrl }
        }));

        setIsAvatarModalOpen(false);
    };

    if (loading) return <Loader />;

    if (!patient)
        return (
            <div className="text-center py-20 text-gray-500">
                Patient not found
            </div>
        );

    return (
        <div className="bg-white rounded-2xl mt-20 shadow-xl border border-teal-200 px-10 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between">

                <button
                    onClick={onBack}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                    ← Back
                </button>

                {/* Avatar */}
                <div className="flex flex-col items-center flex-1">

                    <div className="relative">

                        <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-teal-100">
                            <img
                                src={
                                    patient?.avatar?.src ||
                                    "/images/default-avatar.png"
                                }
                                alt={patient.displayName || patient.fullName}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Edit avatar */}
                        <button
                            type="button"
                            onClick={() => setIsAvatarModalOpen(true)}
                            className="absolute bottom-2 right-2 flex items-center justify-center
                            w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                            hover:bg-teal-500 hover:border-teal-500 transition group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-gray-700 group-hover:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.25 18.463 4.5 19.5l1.037-3.75L16.862 3.487z" />
                                <path d="M18 5l1 1" />
                            </svg>
                        </button>

                    </div>

                </div>

                <div className="w-20" />
            </div>

            {/* Patient Information */}
            <section className="border-t border-slate-200 pt-6">
                <PatientInformation
                    patient={patient}
                    showActions={false}
                    isAdmin={true}
                />
            </section>

            {/* Consultation History */}
            <section className="border border-slate-200 rounded-xl">
                <ConsultationHistoryTable patientId={patient._id} />
            </section>

            {/* Upcoming Appointments */}
            <section className="border border-slate-200 rounded-xl">
                <UpcomingAppointments patientId={patient._id} />
            </section>

            {/* Avatar Modal */}
            <Modal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
            >
                <AvatarCropper
                    user="admin"
                    role="patient"
                    _id={patient._id}
                    onCancel={() => setIsAvatarModalOpen(false)}
                    onSave={handleAvatarSaved}
                />
            </Modal>

        </div>
    );
};

export default AdminPatientDetails;