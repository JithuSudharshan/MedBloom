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
import AvailabilitySettings from "./doctorDasboard/AvailabilitySettings";
import MedicalRecords from "./records/MedicalRecords";
import WalletPage from "./wallet/WalletPage";
import TransactionsPage from "./transactions/TransactionsPage";
import DoctorPatientsList from "./doctorDasboard/patients/DoctorPatientsList";
import SymptomChecker from "./patient/SymptomChecker";

import { useLocation } from "react-router-dom";

const ProfileLayout = ({
    user,
    sidebarMenu,
    profileData,
    onLogout,
    isLoggingOut
}) => {

    const location = useLocation();
    const validDoctorKeys = ["dashboard", "personal", "patients", "availability", "appointments", "publications", "notifications", "transactions", "wallet", "settings"];
    const validPatientKeys = ["dashboard", "personal", "appointments", "records", "triage", "notifications", "transactions", "wallet", "settings"];
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const derivedKey = validDoctorKeys.find(key => pathSegments.includes(key)) ||
        validPatientKeys.find(key => pathSegments.includes(key)) ||
        pathSegments.pop();

    let activeKey = "dashboard";
    if (user === "doctor" && validDoctorKeys.includes(derivedKey)) {
        activeKey = derivedKey;
    } else if (user === "patient" && validPatientKeys.includes(derivedKey)) {
        activeKey = derivedKey;
    } else if (user === "patient") {
        activeKey = "personal"; // Patients don't have a dashboard default
    }

    const [loading, setLoading] = useState(false)
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
    const [localUser, setLocalUser] = useState(profileData)
    const [dashboardMetrics, setDashboardMetrics] = useState([])

    const [appointments, setAppointments] = useState([])
    const [appointmentPage, setAppointmentPage] = useState(1);
    const [totalAppointmentPages, setTotalAppointmentPages] = useState(1)

    const [patients, setPatients] = useState([]);
    const [patientPage, setPatientPage] = useState(1);
    const [totalPatientPages, setTotalPatientPages] = useState(1);
    const [patientSearchTerm, setPatientSearchTerm] = useState('');
    const [patientStats, setPatientStats] = useState({ totalCount: 0, newPatients: 0, activeVisit: 0 });

    const [totalCount, setTotalcount] = useState(0)

    const fetchAppointments = async (pageNumber = 1) => {
        try {

            setLoading(true);

            const res = (user === "patient" ?

                await fetchAppointmentsForPatient({
                    params: { page: pageNumber, limit: 8 }
                }) : await fetchAppointmentsForDoctor({
                    params: { page: pageNumber, limit: 7 }
                }))

            if (!res.data?.success) {
                showToast.error("Something went wrong while fetching appointments")
            }

            const {
                appointments,
                page,
                totalPages,
                totalNoOfAppointments
            } = res?.data?.data || {};

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

    const fetchPatientsList = async (pageNumber = 1, search = '') => {
        try {
            setLoading(true);
            const { fetchMyPatients } = await import('../../api/doctorApi');
            const res = await fetchMyPatients({
                params: { page: pageNumber, limit: 10, search }
            });

            if (!res.data?.success) {
                showToast.error("Failed to fetch patients data");
            }

            const { patients, page, totalPages, totalNoOfPatients } = res?.data?.data || {};
            setPatients(patients || []);
            setPatientPage(page || 1);
            setTotalPatientPages(totalPages || 1);
            setPatientStats(prev => ({ ...prev, totalCount: totalNoOfPatients || 0 }));
            // Note: newPatients and activeVisits would ideally come from the backend payload.
            
        } catch (error) {
            console.error("Failed to fetch patients", error);
            showToast.error("Error fetching patients list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeKey === "patients" && user === "doctor") {
            fetchPatientsList(patientPage, patientSearchTerm);
        }
    }, [activeKey, patientPage, patientSearchTerm, user]);


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
        <div className={`h-screen w-full py-6 lg:py-10 overflow-hidden ${user === 'doctor' ? "bg-[#FCF8F8]" : "bg-[#F8FDFD]"
            }`}>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full px-6 md:px-10 xl:px-16 mx-auto max-w-[1800px] h-full items-start">

                {/* Sidebar */}
                <aside className="w-full lg:w-80 shrink-0">
                    <SidebarMenu
                        menu={sidebarMenu}
                        src={localUser?.avatar?.src}
                        alt={localUser?.avatar?.alt}
                        name={localUser?.fullName}
                        onLogout={onLogout}
                        isLoggingOut={isLoggingOut}
                        onEditAvatar={() => setIsAvatarModalOpen(true)}
                        userRole={user}
                    />

                </aside>

                {/* Main cards and dashboard content */}
                <main className={`flex-1 flex flex-col min-w-0 h-full overflow-y-auto  pr-2 
                    [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:rounded-full 
                    ${user === 'doctor' ? "[&::-webkit-scrollbar-thumb]:bg-[#F5EBEB] hover:[&::-webkit-scrollbar-thumb]:bg-[#E8D3D4]" : "[&::-webkit-scrollbar-thumb]:bg-teal-50 hover:[&::-webkit-scrollbar-thumb]:bg-teal-100"}`}>
                    {activeKey === "dashboard" && (
                        <DoctorOverview
                            doctorName={localUser?.fullName}
                            metrics={dashboardMetrics?.metrics}
                            TotalEarnigs={dashboardMetrics?.TotalEarnigs}
                            monthlyEarnings={dashboardMetrics?.monthlyEarnings}
                            revenueGrowth={dashboardMetrics?.revenueGrowth}
                            TodaysAppointments={dashboardMetrics?.TodaysAppointments}
                            nextAppointment={dashboardMetrics?.nextAppointment}
                            consultationModeRatio={dashboardMetrics?.consultationModeRatio}
                            topReviews={dashboardMetrics?.reviews}
                            ratingStats={dashboardMetrics?.ratingStats}
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
                        userRole={user}
                    />}

                    {activeKey === "patients" && user === "doctor" && (
                        <DoctorPatientsList
                            patients={patients}
                            page={patientPage}
                            setPage={setPatientPage}
                            totalPages={totalPatientPages}
                            patientCount={patientStats.totalCount}
                            newPatients={patientStats.newPatients}
                            activeVisit={patientStats.activeVisit}
                            searchTerm={patientSearchTerm}
                            setSearchTerm={setPatientSearchTerm}
                        />
                    )}


                    {activeKey === "availability" && <AvailabilitySettings userRole={user} />}
                    {activeKey === "notifications" && <NotificationsPage userRole={user} />}
                    {activeKey === "records" && <MedicalRecords />}
                    {activeKey === "wallet" && <WalletPage userRole={user} />}
                    {activeKey === "transactions" && <TransactionsPage userRole={user} />}

                    {activeKey === "triage" && user === "patient" && <SymptomChecker />}

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
