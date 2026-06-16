import { useEffect, useState, useRef } from "react";
import { Lock, Menu, X, AlertCircle } from "lucide-react";
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

import { useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const ProfileLayout = ({
    user,
    sidebarMenu,
    profileData,
    onLogout,
    isLoggingOut,
    children
}) => {
    const navigate = useNavigate();

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

    const [isNavVisible, setIsNavVisible] = useState(true);
    const lastScrollY = useRef(0);

    const handleScroll = (e) => {
        const currentScrollY = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const clientHeight = e.target.clientHeight;

        // iOS overscroll bounce protection
        if (currentScrollY <= 0) {
            setIsNavVisible(true);
            lastScrollY.current = currentScrollY;
            return;
        }

        // Reached bottom
        if (currentScrollY + clientHeight >= scrollHeight - 10) {
            setIsNavVisible(true);
        } 
        // Scrolling down
        else if (currentScrollY > lastScrollY.current + 10) {
            setIsNavVisible(false);
        } 
        // Scrolling up
        else if (currentScrollY < lastScrollY.current - 10) {
            setIsNavVisible(true);
        }

        lastScrollY.current = currentScrollY;
    };

    const handleMainClick = () => {
        if (!isNavVisible && window.innerWidth < 1024) {
            setIsNavVisible(true);
        }
    };

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
        <div className={`flex flex-col h-screen w-full overflow-hidden ${user === 'doctor' ? "bg-[#FCF8F8]" : "bg-[#F8FDFD]"}`}>
            
            {/* Mobile App Bar */}
            <div className={`lg:hidden sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-3xl transition-colors duration-300 ${user === 'doctor' ? 'bg-white/40 border-white/60' : 'bg-white/40 border-white/60'}`}>
                <div className="flex items-center gap-3">
                    <img 
                        src={localUser?.avatar?.src || "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="} 
                        alt="avatar" 
                        referrerPolicy="no-referrer"
                        className={`w-10 h-10 rounded-full object-cover border-2 ${user === 'doctor' ? 'border-[#B08B8C]' : 'border-teal-500'}`} 
                    />
                    <div className={`font-bold text-lg tracking-tight ${user === 'doctor' ? 'text-[#6B3B3D]' : 'text-teal-800'}`}>
                        Hi, {localUser?.fullName?.split(' ')[0] || 'User'}
                    </div>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`p-2 rounded-xl shadow-sm border transition-all active:scale-95 ${user === 'doctor' ? 'text-[#B08B8C] bg-white/50 hover:bg-white border-rose-200' : 'text-teal-700 bg-white/50 hover:bg-white border-teal-100'}`}
                >
                    <Menu size={22} />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full px-4 sm:px-6 md:px-10 xl:px-16 mx-auto max-w-[1800px] flex-1 min-h-0 items-stretch lg:items-start relative py-6 lg:py-10">

                {/* Overlay for mobile drawer */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar Drawer */}
                <aside className={`
                    fixed inset-y-0 left-0 z-[60] w-[85%] max-w-sm transform transition-transform duration-300 ease-in-out bg-transparent
                    lg:relative lg:w-80 lg:translate-x-0 lg:z-auto lg:block shrink-0
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="h-full w-full p-4 lg:p-0">
                        {/* Close button inside drawer for mobile */}
                        <button 
                            className="absolute top-8 right-8 z-50 p-2 bg-white rounded-full shadow-md text-slate-500 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={20} />
                        </button>

                        <SidebarMenu
                            menu={sidebarMenu}
                            src={localUser?.avatar?.src}
                            alt={localUser?.avatar?.alt}
                            name={localUser?.fullName}
                            onLogout={onLogout}
                            isLoggingOut={isLoggingOut}
                            onEditAvatar={() => {
                                setIsAvatarModalOpen(true);
                                setIsMobileMenuOpen(false);
                            }}
                            userRole={user}
                            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                </aside>

                {/* Main cards and dashboard content */}
                <main 
                    onScroll={handleScroll}
                    onClick={handleMainClick}
                    className={`flex-1 flex flex-col min-w-0 h-full overflow-y-auto pr-2 pb-24 lg:pb-0 scroll-smooth
                    [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:rounded-full 
                    ${user === 'doctor' ? "[&::-webkit-scrollbar-thumb]:bg-[#F5EBEB] hover:[&::-webkit-scrollbar-thumb]:bg-[#E8D3D4]" : "[&::-webkit-scrollbar-thumb]:bg-teal-50 hover:[&::-webkit-scrollbar-thumb]:bg-teal-100"}`}>
                    
                    {user === 'doctor' && localUser?.status === 'pending' && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl mb-6 flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Profile Under Review</h3>
                                <p className="text-sm opacity-90">Your profile is currently under review. You will be notified once the admin approves your account. Until then, patients cannot see your profile or book appointments.</p>
                            </div>
                        </div>
                    )}
                    {user === 'doctor' && localUser?.status === 'rejected' && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-6 py-4 rounded-2xl mb-6 flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Application Rejected</h3>
                                <p className="text-sm opacity-90">Your application was not approved. Please contact support for more information or to re-apply.</p>
                            </div>
                        </div>
                    )}
                    {user === 'doctor' && localUser?.status === 'blocked' && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-6 flex items-start gap-3 shadow-sm">
                            <Lock className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Account Suspended</h3>
                                <p className="text-sm opacity-90">Your profile has been suspended by an administrator. Please contact support for assistance.</p>
                            </div>
                        </div>
                    )}

                    {(!profileData?.isOnboarded && 
                        ((user === "doctor" && !["dashboard", "notifications"].includes(activeKey)) || 
                         (user === "patient" && !["personal", "notifications"].includes(activeKey)))
                    ) ? (
                        <div className="flex flex-col items-center justify-center h-full bg-white rounded-[2.5rem] p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${user === 'doctor' ? 'bg-rose-50' : 'bg-teal-50'}`}>
                                <Lock className={`w-10 h-10 ${user === 'doctor' ? 'text-rose-500' : 'text-teal-500'}`} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Action Required</h2>
                            <p className="text-gray-500 max-w-md mb-8">
                                {user === 'doctor' 
                                    ? `You must complete your professional onboarding process before you can access ${activeKey.replace('-', ' ')}. This ensures your profile is fully verified for patients.`
                                    : `You must complete your health profile onboarding before you can access ${activeKey.replace('-', ' ')}. This helps our doctors provide the best care.`}
                            </p>
                            <Button 
                                role={user} 
                                onClick={() => navigate(user === 'doctor' ? "/doctor/basic-onboarding" : "/patient/onboarding")} 
                                className="px-8"
                            >
                                Complete Onboarding Now
                            </Button>
                        </div>
                    ) : (
                        <>
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
                    {children}
                        </>
                    )}

                </main>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-3xl border-t shadow-[0_-8px_30px_rgba(0,0,0,0.05)] px-6 py-3 flex items-center justify-between pb-safe transform transition-transform duration-300 ease-in-out ${isNavVisible ? 'translate-y-0' : 'translate-y-full'} ${user === 'doctor' ? 'bg-white/40 border-white/60' : 'bg-white/40 border-white/60'}`}>
                {sidebarMenu.filter(item => {
                    if (user === 'doctor') return ['dashboard', 'appointments', 'Patients', 'personal'].includes(item.key);
                    return ['personal', 'appointments', 'triage', 'records'].includes(item.key);
                }).map(item => {
                    const Icon = item.icon;
                    const isActive = activeKey === item.key;
                    
                    return (
                        <button 
                            key={item.key} 
                            onClick={() => navigate(item.path)} 
                            className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${
                                isActive 
                                    ? (user === 'doctor' ? 'text-[#B08B8C] scale-105' : 'text-teal-600 scale-105') 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? (user === 'doctor' ? 'fill-rose-50 stroke-[2.5px]' : 'fill-teal-50 stroke-[2.5px]') : 'stroke-2'}`} />
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {item.label === 'Your Dashboard' ? 'Dashboard' : item.label}
                            </span>
                        </button>
                    )
                })}
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
