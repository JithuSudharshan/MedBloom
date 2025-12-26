import { useEffect, useState } from "react";
import EarningsSummary from "./EarningsSummary";
import ConsultationHistoryTable from "./ConsultationHistoryTable";
import UpcomingAppointments from "./UpcomingAppointments";
import ReviewsSection from "./ReviewsSection";
import DoctorInformation from "../../DoctorInformation";
import { showToast } from "../../../ui/Toast";
import { loadLocalDoctor } from "../../../../api/adminApi";
import Loader from "../../../ui/Loading";
import Modal from "../../Modal";
import AvatarCropper from "../../AvatarCropper";

const AdminDoctorDetails = ({ doctorId, onBack }) => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)


    const handleAvatarSaved = (newAvatarUrl) => {
        setDoctor((prev) => ({
            ...prev,
            profilePicture: newAvatarUrl,
        }));
        setIsAvatarModalOpen(false);
    };


    if (!doctorId) return null;

    const fetchDoctorDetails = async (id) => {
        try {
            setLoading(true);
            const res = await loadLocalDoctor(id);

            if (!res.data?.success) {
                showToast.error(res.data?.message || "Something went wrong");
                return;
            }

            setDoctor(res.data.details);
        } catch (error) {
            console.error("Error loading doctor details:", error);
            showToast.error("Something went wrong while loading doctor details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctorDetails(doctorId);
    }, [doctorId]);

    if (loading || !doctor) {
        return (
            <Loader />
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-teal-200 px-10 py-8 space-y-6">
            {/* Header: back button + avatar + short bio */}
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
                                src={doctor.profilePicture}
                                alt={doctor.displayName || doctor.fullName}
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


                    <div className="max-w-xl text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                            Short bio
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {doctor.shortBio || "No bio added yet."}
                        </p>
                    </div>
                </div>

                <div className="w-20" />
            </div>

            {/* Basic + professional details */}
            <section className="border-t border-slate-200 pt-6">
                <DoctorInformation doctor={doctor} showActions={false} isAdmin={true} />
            </section>

            <EarningsSummary doctorId={doctor._id} />
            <ConsultationHistoryTable doctorId={doctor._id} />
            <UpcomingAppointments doctorId={doctor._id} />
            <ReviewsSection doctorId={doctor._id} />

            <section className="border border-slate-200 rounded-xl px-6 py-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">
                    Availability
                </p>
                <div className="h-40 w-full bg-slate-50 rounded-md flex items-center justify-center text-xs text-slate-400">
                    Calendar goes here
                </div>
            </section>

            <Modal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
            >
                <AvatarCropper
                    user={"admin"}
                    role={"doctor"}
                    _id={doctor._id}
                    onCancel={() => setIsAvatarModalOpen(false)}
                    onSave={handleAvatarSaved}
                />
            </Modal>
        </div>
    );
};

export default AdminDoctorDetails;
