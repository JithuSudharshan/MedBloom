import { useEffect, useState } from "react";
import EarningsSummary from "./EarningsSummary";
import ConsultationHistoryTable from "./ConsultationHistoryTable";
import UpcomingAppointments from "./UpcomingAppointments";
import ReviewsSection from "./ReviewsSection";
import DoctorInformation from "../../DoctorInformation";
import { showToast } from "../../../ui/Toast";
import { loadLocalDoctor } from "../../../../api/adminApi";

const AdminDoctorDetails = ({ doctorId, onBack, mode }) => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(false);

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
            <div className="bg-white rounded-2xl shadow-xl border border-teal-200 px-10 py-8">
                <p className="text-sm text-slate-500">Loading doctor details...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-teal-200 px-10 py-8 space-y-6">
            {/* Header: back + avatar + short bio */}
            <div className="flex items-start justify-between">
                <button
                    onClick={onBack}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                    ← Back
                </button>

                <div className="flex flex-col items-center flex-1">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-teal-100 mb-4">
                        <img
                            src={doctor.profilePicture}
                            alt={doctor.displayName || doctor.fullName}
                            className="h-full w-full object-cover"
                        />
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

            {/* Basic + professional details (reuse your component, no actions) */}
            <section className="border-t border-slate-200 pt-6">
                <DoctorInformation doctor={doctor} showActions={false} isAdmin={true} />
            </section>

            {/* Admin-only sections below */}
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
        </div>
    );
};

export default AdminDoctorDetails;
