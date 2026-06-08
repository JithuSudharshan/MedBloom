import { useEffect, useState } from "react";
import DoctorApprovalList from "../DoctorApprovalList";
import ListDoctorsForAdmin from "./doctorProfile/ListDoctorsForAdmin";
import SidebarMenu from "../SidebarMenu";
import adminPic from '../../../assets/images/admin.jpg'
import Modal from "../Modal";
import { Menu, X } from "lucide-react";
import ConfirmDialog from "../../ui/ConfirmDialogue";
import { showToast } from "../../ui/Toast";
import {
    blockDoctor,
    fetchAppointmentsForAdmin,
    fetchApprovedList,
    fetchDataForTable,
    fetchMetricsForAdmin,
    fetchPatientsList,
    unblockDoctor
} from "../../../api/adminApi";
import ListPatientsForAdmin from "./patientProfile/ListPatientsForAdmin";
import { useNavigate, useLocation } from "react-router-dom";
import ListOfDepartments from "./ListOfDepartments.jsx";
import AddDepartmentForm from "./AddDepartmentForm";
import { useDepartmentForm } from "../../../hooks/useDepartmentForm.js"
import ServiceOverview from "./dashboard/ServiceOverview.jsx";
import AdminAppointmentsTable from "./appointments/AdminAppointmentsTable.jsx";
import NotificationsPage from "../NotificationsPage.jsx";
import Loader from "../../ui/Loading.jsx";
import WalletPage from "../wallet/WalletPage.jsx";


const AdminProfileLayout = ({ sidebarMenu, onLogout, isLoggingOut }) => {


    const location = useLocation();
    const derivedKey = location.pathname.split("/").pop();
    const isValidKey = ["dashboard", "doctors", "patients", "appointments", "departments", "notifications", "wallet"].includes(derivedKey);
    const activeKey = isValidKey ? derivedKey : "dashboard";

    const [openApproval, setOpenApproval] = useState(false);
    const [dashboardMetrics, setDashboardMetrics] = useState([])
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [doctorPage, setDoctorPage] = useState(1);
    const [patientPage, setPatientPage] = useState(1);
    const [appointmentPage, setAppointmentPage] = useState(1);
    const [totalPatientPages, setTotalPatientPages] = useState(1)
    const [totalDoctorPages, setTotalDoctorPages] = useState(1)
    const [totalAppointmentPages, setTotalAppointmentPages] = useState(1)
    const [appointmentSearchTerm, setAppointmentSearchTerm] = useState("")
    const [appointmentTab, setAppointmentTab] = useState("All")
    const [doctorSearchTerm, setDoctorSearchTerm] = useState("")
    const [patientSearchTerm, setPatientSearchTerm] = useState("")
    const [departmentSearchTerm, setDepartmentSearchTerm] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [departmentPage, setDepartmentPage] = useState(1);
    const [totalDepartmentPages, setTotalDepartmentPages] = useState(1);
    const [departmentMetrics, setDepartmentMetrics] = useState({ total: 0, active: 0, inactive: 0 });

    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [appointments, setAppointments] = useState([])

    const [totalCount, setTotalcount] = useState(0)
    const [pendingCount, setPendingCount] = useState(0)
    const [newPatientsCount, setNewPatientsCount] = useState(0);
    const [activeVisitsCount, setActiveVisitsCount] = useState(0);

    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
    const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)


    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [departmentData, setDepartmentData] = useState([])


    const fetchDepartments = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await fetchDataForTable({
                params: { page: pageNumber, limit: 10, search: departmentSearchTerm, status: departmentFilter }
            });

            if (res?.data?.success) {
                setDepartmentData(res.data.data.departments || []);
                setDepartmentPage(res.data.data.page);
                setTotalDepartmentPages(res.data.data.totalPages);
                if (res.data.data.metrics) setDepartmentMetrics(res.data.data.metrics);
            } else {
                showToast.error("Failed to fetch departments");
            }
        } catch (error) {
            console.error("Failed to load departments:", error);
            showToast.error("Something went wrong while fetching data");
        } finally {
            setLoading(false);
        }
    };

    const fetchApprovedDoctors = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await fetchApprovedList({
                params: { page: pageNumber, limit: 5, search: doctorSearchTerm }
            })

            if (!res.data?.success) {
                showToast.error("Something went wrong while fetching data")
            }

            const {
                doctors,
                page,
                totalPages,
                totalNoOfDoctors,
                totalPending
            } = res?.data?.data || {};

            setDoctors(doctors);
            setDoctorPage(page);
            setTotalDoctorPages(totalPages);
            setTotalcount(totalNoOfDoctors)
            setPendingCount(totalPending)
        } catch (err) {
            console.error("Failed to load pending doctors:", err);
            showToast.error("Something  wrong while fetching data")
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await fetchPatientsList({
                params: { page: pageNumber, limit: 15, search: patientSearchTerm }
            })

            if (!res.data?.success) {
                showToast.error("Something went wrong while fetching data")
            }
            const {
                patients,
                page,
                totalPages,
                totalPatients,
                newPatientsCount,
                activeVisitsCount
            } = res?.data?.data || {};

            setTotalcount(totalPatients)
            setNewPatientsCount(newPatientsCount || 0);
            setActiveVisitsCount(activeVisitsCount || 0);
            setPatients(patients);
            setPatientPage(page);
            setTotalPatientPages(totalPages);
        } catch (err) {
            console.error("Failed to load total patints:", err);
            showToast.error("Something  wrong while fetching data")
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async (pageNumber = 1) => {
        try {

            setLoading(true);

            const res = await fetchAppointmentsForAdmin({
                params: { page: pageNumber, limit: 10, search: appointmentSearchTerm, status: appointmentTab }
            })

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
            console.error("Failed to fetch appoitments", err);
            showToast.error("Something  wrong while fetching data")
        } finally {
            setLoading(false);
        }
    }

    const fetchMetrics = async () => {
        try {
            setLoading(true)
            if (activeKey !== "dashboard") return;
            const response = await fetchMetricsForAdmin()
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
            const timer = setTimeout(() => {
                fetchAppointments(appointmentPage);
            }, 500); // 500ms debounce
            return () => clearTimeout(timer);
        }
    }, [activeKey, appointmentPage, appointmentSearchTerm, appointmentTab]);


    useEffect(() => {
        if (activeKey === "doctors") {
            const timer = setTimeout(() => {
                fetchApprovedDoctors(doctorPage);
            }, 500);
            return () => clearTimeout(timer);
        }
        if (activeKey === "patients") {
            const timer = setTimeout(() => {
                fetchPatients(patientPage);
            }, 500);
            return () => clearTimeout(timer);
        }
        if (activeKey === "departments") {
            const timer = setTimeout(() => {
                fetchDepartments(departmentPage);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [activeKey, doctorPage, patientPage, departmentPage, doctorSearchTerm, patientSearchTerm, departmentSearchTerm, departmentFilter]);

    useEffect(() => {
        if (activeKey === "dashboard") {
            fetchMetrics()
        }
    }, [activeKey])

    const handleViewApprovedDoctor = (doctor) => {
        console.log("doctor details", doctor)
        navigate(`/admin/doctors/${doctor._id}`)
    };

    const handleOpenApproval = () => setOpenApproval(true);
    const handleCloseApproval = () => setOpenApproval(false);

    const handleConfirmBlock = async () => {
        try {
            if (!selectedDoctorId) return;
            const response = await blockDoctor(selectedDoctorId)
            if (!response.data.success) {
                showToast.error(response.data.message || "Failed to block doctor. Please try again.")
                return;
            }
            await fetchApprovedDoctors(doctorPage)

            showToast.success("Doctor blocked successfully.")

        } catch (error) {
            console.log(error)
        } finally {
            setIsBlockModalOpen(false)
        }
    }

    const handleConfirmUnblock = async () => {
        try {
            if (!selectedDoctorId) return;

            const response = await unblockDoctor(selectedDoctorId)

            if (!response.data.success) {
                showToast.error(response.data.message || "Failed to unblock doctor. Please try again.")
                return;
            }
            await fetchApprovedDoctors(patientPage)

            showToast.success("Doctor unblocked successfully.")

        } catch (error) {
            console.log(error)
        } finally {
            setIsUnblockModalOpen(false)
        }
    }

    const openBlockModal = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setIsBlockModalOpen(true);
    };

    const openUnblockModal = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setIsUnblockModalOpen(true);
    };

    const handleViewPatient = (patient) => {
        navigate(`/admin/patients/${patient._id}`);
    };

    const handleAddDpt = () => {
        setIsAddModalOpen(true)
    };

    const handleEditDepartment = (departmentId) => {
        setSelectedDepartment(departmentId);
        setIsEditModalOpen(true);
    }

    const {
        register,
        handleSubmit,
        onSubmit,
        setValue,
        reset,
        errors,
        isSubmitting,
        submitError,
    } = useDepartmentForm();

    useEffect(() => {
        if (isEditModalOpen && selectedDepartment) {
            reset(selectedDepartment);
        } else {
            reset({
                departmentName: "",
                departmentDescription: "",
                status: ""
            });
        }
    }, [isEditModalOpen, selectedDepartment, reset]);



    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-[#F8FDFD]">
            
            {/* Mobile App Bar */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,109,111,0.06)]">
                <div className="font-bold text-xl text-[#006D6F] tracking-tight">MEDBLOOM Admin</div>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 -mr-2 text-teal-700 bg-white/50 hover:bg-white rounded-xl shadow-sm border border-teal-100 transition-all active:scale-95"
                >
                    <Menu size={22} />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full px-4 sm:px-6 md:px-10 xl:px-16 mx-auto max-w-[1800px] flex-1 min-h-0 items-stretch lg:items-start relative py-6 lg:py-10">
                
                {/* Overlay for mobile */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar Drawer */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm transform transition-transform duration-300 ease-in-out bg-transparent
                    lg:relative lg:w-80 lg:translate-x-0 lg:z-auto
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
                            isAdmin={true}
                            menu={sidebarMenu}
                            src={adminPic}
                            alt={"admin Photo"}
                            name={"Admin"}
                            activeKey={activeKey}
                            onLogout={onLogout}
                            isLoggingOut={isLoggingOut}
                            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                </aside>

                <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pr-2 pb-6 lg:pb-0
                    [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:rounded-full 
                    [&::-webkit-scrollbar-thumb]:bg-teal-50 hover:[&::-webkit-scrollbar-thumb]:bg-teal-100">
                    {activeKey === "dashboard" && (
                        <ServiceOverview
                            metrics={dashboardMetrics?.metrics}
                            MonthlyEarnings={dashboardMetrics?.monthlyEarnings}
                            revenueGrowth={dashboardMetrics?.revenueGrowth}
                            TopRatedDoctors={dashboardMetrics?.TopRatedDoctors}
                            graphData={dashboardMetrics?.graphData}
                        />
                    )}
                    {activeKey === "doctors" && (
                        openApproval ? (
                            <DoctorApprovalList
                                onBack={handleCloseApproval}
                            />
                        ) : (
                            <ListDoctorsForAdmin
                                doctors={doctors}
                                page={doctorPage}
                                totalPages={totalDoctorPages}
                                doctorsCount={totalCount}
                                pendingCount={pendingCount}
                                setPage={setDoctorPage}
                                handleOpenApproval={handleOpenApproval}
                                viewDetails={handleViewApprovedDoctor}
                                onOpenBlock={openBlockModal}
                                onOpenUnblock={openUnblockModal}
                                searchTerm={doctorSearchTerm}
                                setSearchTerm={setDoctorSearchTerm}
                            />
                        )
                    )}
                    {activeKey === "patients" && (
                        <ListPatientsForAdmin
                            onViewPatient={handleViewPatient}
                            patients={patients}
                            patientCount={totalCount}
                            newPatients={newPatientsCount}
                            activeVisit={activeVisitsCount}
                            setPage={setPatientPage}
                            page={patientPage}
                            totalPages={totalPatientPages}
                            searchTerm={patientSearchTerm}
                            setSearchTerm={setPatientSearchTerm}
                        />
                    )}
                    {activeKey === "appointments" && <AdminAppointmentsTable
                        appointments={appointments}
                        page={appointmentPage}
                        totalPages={totalAppointmentPages}
                        setPage={setAppointmentPage}
                        searchTerm={appointmentSearchTerm}
                        setSearchTerm={setAppointmentSearchTerm}
                        activeTab={appointmentTab}
                        setActiveTab={setAppointmentTab}
                    />}

                    {activeKey === "departments" && (
                        <ListOfDepartments
                            data={departmentData}
                            openModalForAdding={handleAddDpt}
                            openModalForEditing={handleEditDepartment}
                            page={departmentPage}
                            totalPages={totalDepartmentPages}
                            setPage={setDepartmentPage}
                            searchTerm={departmentSearchTerm}
                            setSearchTerm={setDepartmentSearchTerm}
                            filter={departmentFilter}
                            setFilter={setDepartmentFilter}
                            metrics={departmentMetrics}
                        />
                    )}
                    {activeKey === "notifications" && (<NotificationsPage userRole="admin" />)}
                    {activeKey === "wallet" && (<WalletPage userRole="admin" />)}
                </main>
            </div>

            { /*--------------------- Confirmation modals for blocking & unblocking doctor---------------------*/}

            {/* Block modal */}
            <Modal
                isOpen={isBlockModalOpen}
                onClose={() => {
                    setIsBlockModalOpen(false);
                    setSelectedDoctorId(null);
                }}
            >
                <ConfirmDialog
                    title="Block this doctor?"
                    message="Are you sure you want to block this user? They will no longer be available for new appointments."
                    confirmLabel="Yes, block"
                    cancelLabel="No, cancel"
                    onConfirm={handleConfirmBlock}
                    onCancel={() => {
                        setIsBlockModalOpen(false);
                        setSelectedDoctorId(null);
                    }}
                />
            </Modal>

            {/* Unblock modal */}
            <Modal
                isOpen={isUnblockModalOpen}
                onClose={() => {
                    setIsUnblockModalOpen(false);
                    setSelectedDoctorId(null);
                }}
            >
                <ConfirmDialog
                    title="Unblock this doctor?"
                    message="Are you sure you want to unblock this doctor? They will become available for new appointments again."
                    confirmLabel="Yes, unblock"
                    cancelLabel="No, keep blocked"
                    onConfirm={handleConfirmUnblock}
                    onCancel={() => {
                        setIsUnblockModalOpen(false);
                        setSelectedDoctorId(null);
                    }}
                />
            </Modal>

            {/* Add New department */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    reset({});
                }
                }
            >
                <AddDepartmentForm
                    cardTitle="Add new Department"
                    setDepartmentData={() => fetchDepartments(departmentPage)}
                    setIsModalOpen={setIsAddModalOpen}
                    mode="addDepartment"
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            </Modal>


            {/* Edit department */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedDepartment(null)
                }
                }
            >
                <AddDepartmentForm
                    cardTitle="Edit Department"
                    setDepartmentData={() => fetchDepartments(departmentPage)}
                    setIsModalOpen={setIsEditModalOpen}
                    department_id={selectedDepartment?._id || selectedDepartment?.id}
                    mode="edit"
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    setValue={setValue}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            </Modal>
            {loading && <Loader />}
        </div>
    );
};
export default AdminProfileLayout;