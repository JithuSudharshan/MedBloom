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
    const [loading, setLoading] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
    console.log("patient", patient)


    const handleAvatarSaved = (newAvatarUrl) => {
        setPatient((prev) => ({
            ...prev,
            avatar: { ...(prev?.avatar || {}), src: newAvatarUrl },
        }));
        setIsAvatarModalOpen(false);
    };

    if (!patientId) return <Loader />;

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
            <div className="flex items-start justify-between">
                <button
                    onClick={onBack}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                    ← Back
                </button>

                <div className="flex flex-col items-center flex-1">
                    <div className="relative">
                        <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-teal-100 mb-4">
                            <img
                                src={patient?.avatar?.src}
                                alt={patient.displayName || patient.fullName}
                                className="h-full w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => setIsAvatarModalOpen(true)}
                                className="group absolute overflow-auto bottom-3 right-3 flex items-center justify-center
               w-10 h-10 rounded-full bg-white/95 shadow-lg border border-gray-200
               hover:bg-teal-500 hover:border-teal-500 transition
               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                aria-label="Change profile picture"
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
            <Modal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
            >
                <AvatarCropper
                    user={"admin"}
                    role={"patient"}
                    _id={patient._id}
                    onCancel={() => setIsAvatarModalOpen(false)}
                    onSave={handleAvatarSaved}
                />
            </Modal>
        </div>
    );
};

export default AdminPatientDetails;
