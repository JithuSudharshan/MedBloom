import { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import PatientInformation from "./PatientInformation";
import AppointmentsSection from "./appointments/AppointmentsSection";
import Modal from "./Modal";
import AvatarCropper from "./AvatarCropper";
import DoctorInformation from "./DoctorInformation";
import NotificationsPage from "./NotificationsPage";
import DoctorOverview from "./doctorDasboard/DoctorOverview";
import { fetchAppointmentsForPatient } from "../../api/patientApi";
import { showToast } from "../ui/Toast";
import Loader from "../ui/Loading";
import { fetchAppointmentsForDoctor, fetchMetricsForDoctor } from "../../api/doctorApi";

const ProfileLayout = ({
    user,
    sidebarMenu,
    profileData,
    onLogout,
    isLoggingOut,
    isActive
}) => {

    const [loading, setLoading] = useState(false)

    const [activeKey, setActiveKey] = useState(isActive)
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
    const [localUser, setLocalUser] = useState(profileData)
    const [dashboardMetrics, setDashboardMetrics] = useState([])

    const [appointments, setAppointments] = useState([])
    const [appointmentPage, setAppointmentPage] = useState(1);
    const [totalAppointmentPages, setTotalAppointmentPages] = useState(1)

    const [totalCount, setTotalcount] = useState(0)

    const fetchAppointments = async (pageNumber = 1) => {
        try {

            setLoading(true);

            const res = (user === "patient" ?

                await fetchAppointmentsForPatient({
                    params: { page: pageNumber, limit: 5 }
                }) : await fetchAppointmentsForDoctor({
                    params: { page: pageNumber, limit: 5 }
                }))

            if (!res.data?.success) {
                showToast.error("Something went wrong while fetching appointments")
            }

            const {
                appointments,
                page,
                totalPages,
                totalNoOfAppointments
            } = res?.data?.data;

            setAppointments(appointments);
            setAppointmentPage(page);
            setTotalAppointmentPages(totalPages);
            setTotalcount(totalNoOfAppointments);

        } catch (err) {
            console.error("Failed to fetch appointments", err);
            showToast.error("Something  wrong while fetching data")
        } finally {
            setLoading(false);
        }
    }

    const fetchMetrics = async () => {
        try {
            setLoading(true)
            if (activeKey !== "dashboard") return;
            const response = await fetchMetricsForDoctor()
            if (!response.data.success) {
                showToast.error(response.error.message || "Failed to fetch Dashboard Data")
            }
            setDashboardMetrics(response?.data)

            console.log("dashboardMetrics", dashboardMetrics)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (activeKey === "appointments") {
            fetchAppointments(appointmentPage);
        }
    }, [activeKey, appointmentPage]);


    useEffect(() => {
        setLocalUser(profileData)
    }, [profileData])

    useEffect(() => {
        if (activeKey === "dashboard") {
            fetchMetrics()
        }
    }, [activeKey])


    const handleAvatarSaved = (newAvatarUrl) => {
        setLocalUser((prev) => ({
            ...prev,
            avatar: { ...(prev?.avatar || {}), src: newAvatarUrl },
        }));
        setIsAvatarModalOpen(false);
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto w-full">
            <div className="flex gap-10 items-stretch max-w-7xl mx-auto">

                {/* Sidebar */}
                <aside>
                    <SidebarMenu
                        menu={sidebarMenu}
                        src={localUser?.avatar?.src}
                        alt={localUser?.avatar?.alt}
                        name={localUser?.fullName}
                        activeKey={activeKey}
                        onChange={setActiveKey}
                        onLogout={onLogout}
                        isLoggingOut={isLoggingOut}
                        onEditAvatar={() => setIsAvatarModalOpen(true)}
                    />

                </aside>

                {/* Main cards and dashboard content */}
                <main className="flex-1 mt-15 flex">
                    {activeKey === "dashboard" && (
                        <DoctorOverview
                            doctorName={localUser?.fullName}
                            metrics={dashboardMetrics?.metrics}
                            TotalEarnigs={dashboardMetrics?.TotalEarnigs}
                            TodaysAppointments={dashboardMetrics?.TodaysAppointments}
                            topReviews={dashboardMetrics?.reviews}
                        />
                    )}
                    {activeKey === "personal" && (
                        <>
                            {user === "patient" && (
                                <PatientInformation patient={localUser} />
                            )}
                            {user === "doctor" && (
                                <DoctorInformation doctor={localUser} />
                            )}
                        </>
                    )}
                    {activeKey === "appointments" && <AppointmentsSection
                        appointments={appointments}
                        page={appointmentPage}
                        totalPages={totalAppointmentPages}
                        setPage={setAppointmentPage}
                    />}


                    {activeKey === "notifications" && (<NotificationsPage profileTitle="Doctor Profile" />)}

                </main>
            </div>

            <Modal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
            >
                <AvatarCropper
                    user={user}
                    onCancel={() => setIsAvatarModalOpen(false)}
                    onSave={handleAvatarSaved}
                />
            </Modal>
            {loading && <Loader />}
        </div>
    );
};

export default ProfileLayout;
