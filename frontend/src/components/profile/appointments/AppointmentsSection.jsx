import { useState, useMemo } from "react";
import { cancelPatientAppointment } from "../../../api/patientApi";
import { useParams, useNavigate } from "react-router-dom";
import AppointmentCard from "./AppointmentCard";
import AppointmentDrawer from "./AppointmentDrawer";
import CancelAppointmentModal from "./CancelAppointmentModal";
import { Pagination } from "../../ui/Pagination";
import FindDoctorModal from "./FindDoctorModal";
import ReviewModal from "./ReviewModal";
import PrescriptionBuilderModal from "./PrescriptionBuilderModal";
import ViewPrescriptionModal from "./ViewPrescriptionModal";

const TABS = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentsSection({
    appointments = [],
    page,
    totalPages,
    setPage,
    userRole = "patient",
}) {
    const isDoctor = userRole === 'doctor';
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFindDoctorOpen, setIsFindDoctorOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [appointmentToReview, setAppointmentToReview] = useState(null);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [appointmentForPrescription, setAppointmentForPrescription] = useState(null);
    const [isViewPrescriptionOpen, setIsViewPrescriptionOpen] = useState(false);
    const [appointmentToViewPrescription, setAppointmentToViewPrescription] = useState(null);

    const handleReschedule = (app) => {
        const docId = app.doctorId || app.doctor; // Use appropriate property
        navigate(`/doctor/${docId}?reschedule=true&oldId=${app.id || app._id}&oldMode=${app.consultationMode}`);
    };

    const initiateCancel = (app) => {
        setAppointmentToCancel(app);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async (reason) => {
        if (!appointmentToCancel) return;
        
        try {
            const appointmentId = appointmentToCancel.id || appointmentToCancel._id;
            const res = await cancelPatientAppointment(appointmentId, reason);
            
            if (res.data?.success) {
                // Optimistically update the UI instead of forcing a full reload
                // Note: The ideal way would be to call a fetchAppointments function passed from ProfileLayout.
                // For now, we update the local object (though this won't persist across unmounts without refetching)
                appointmentToCancel.status = 'Cancelled';
            }
        } catch (error) {
            console.error("Failed to cancel appointment", error);
        } finally {
            setIsCancelModalOpen(false);
            setAppointmentToCancel(null);
        }
    };

    const filteredAppointments = useMemo(() => {

        return appointments.filter((app) => {

            const matchesTab =
                activeTab === "All" || app.status === activeTab;

            const matchesSearch =
                (app.primaryTitle && app.primaryTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.doctorName && app.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.secondaryText && app.secondaryText.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.speciality && app.speciality.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesTab && matchesSearch;

        });

    }, [appointments, activeTab, searchTerm]);

    const selectedAppointment = id ? appointments.find(app => app.id === id || app._id === id) : null;

    return (
        <section className={`bg-white rounded-[3rem] px-8 py-10 w-full flex-1 flex flex-col ${
            isDoctor ? "shadow-[0_20px_60px_-15px_rgba(176,139,140,0.2)]" : "shadow-[0_20px_60px_-15px_rgba(0,109,111,0.2)]"
        }`}>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className={`text-[20px] font-semibold ${isDoctor ? "text-[#6B3B3D]" : "text-[#006D6F]"}`}>
                    My Appointments
                </h2>

                {!isDoctor && (
                    <button 
                        onClick={() => setIsFindDoctorOpen(true)}
                        className="rounded-full bg-[#008C89] px-6 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-[#006e6b] transition"
                    >
                        Book New Appointment
                    </button>
                )}
            </div>

            {/* Search */}


            {/* Tabs */}
            {appointments.length !== 0 &&
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                        {TABS.map((tab) => {

                            const isActive = tab === activeTab;

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`rounded-md border px-4 py-2 text-[13px] font-medium transition ${isActive
                                        ? (isDoctor ? "border-[#B08B8C] bg-[#B08B8C] text-white" : "border-[#008C89] bg-[#008C89] text-white")
                                        : "border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-[#F3F4F6]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>
            }



            {/* Appointment List */}
            <div className="flex flex-col gap-5 flex-1">

                {filteredAppointments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-10">
                        No appointments found
                    </p>
                ) : (
                    filteredAppointments.map((app) => (
                        <AppointmentCard
                            key={app.id}
                            primaryTitle={app.primaryTitle || app.doctorName}
                            secondaryText={app.secondaryText || app.speciality}
                            dateTimeLabel={app.dateTimeLabel}
                            status={app.status}
                            showFeedback={app.status === "Completed" && !app.isReviewed}
                            onFeedback={() => {
                                setAppointmentToReview(app);
                                setIsReviewModalOpen(true);
                            }}
                            onViewPrescription={() => {
                                setAppointmentToViewPrescription(app);
                                setIsViewPrescriptionOpen(true);
                            }}
                            hasPrescription={Array.isArray(app.prescription) && app.prescription.length > 0}
                            onReschedule={() => handleReschedule(app)}
                            onCancel={() => initiateCancel(app)}
                            onViewDetails={() => navigate(`/${userRole}/appointments/${app.id || app._id}`)}
                            userRole={userRole}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="mt-8">
                <Pagination
                    current={page}
                    total={totalPages}
                    onChange={setPage}
                    userRole={userRole}
                />
            </div>

            {/* Find Doctor Modal */}
            <FindDoctorModal 
                isOpen={isFindDoctorOpen} 
                onClose={() => setIsFindDoctorOpen(false)} 
            />

            {/* Cancel Modal */}
            <CancelAppointmentModal 
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setAppointmentToReview(null);
                }}
                appointment={appointmentToReview}
                onSuccess={() => {
                    if (appointmentToReview) {
                        appointmentToReview.isReviewed = true;
                    }
                }}
            />

            {/* Prescription Builder Modal */}
            <PrescriptionBuilderModal 
                isOpen={isPrescriptionModalOpen}
                onClose={() => {
                    setIsPrescriptionModalOpen(false);
                    setAppointmentForPrescription(null);
                }}
                appointment={appointmentForPrescription}
                onSuccess={() => {
                    if (appointmentForPrescription) {
                        appointmentForPrescription.prescription = true;
                    }
                }}
            />

            {/* View Prescription Modal */}
            <ViewPrescriptionModal
                isOpen={isViewPrescriptionOpen}
                onClose={() => {
                    setIsViewPrescriptionOpen(false);
                    setAppointmentToViewPrescription(null);
                }}
                appointment={appointmentToViewPrescription}
            />

            {/* Slide-over Drawer */}
            <AppointmentDrawer 
                isOpen={!!(id && selectedAppointment)}
                onClose={() => navigate(`/${userRole}/appointments`)}
                appointment={selectedAppointment}
                userRole={userRole}
                onCancel={() => initiateCancel(selectedAppointment)}
                onReschedule={() => handleReschedule(selectedAppointment)}
                onWritePrescription={(app) => {
                    setAppointmentForPrescription(app);
                    setIsPrescriptionModalOpen(true);
                }}
            />

        </section>
    );
}