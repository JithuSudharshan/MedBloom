import { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import PatientInformation from "./PatientInformation";
import AppointmentsSection from "./appointments/AppointmentsSection";
import Modal from "./Modal";
import AvatarCropper from "./AvatarCropper";

const PatientProfileLayout = ({
    sidebarMenu,
    patient,
    appointments,
    onLogout,
    isLoggingOut,
}) => {
    const [activeKey, setActiveKey] = useState("personal")
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
    const [localPatient, setLocalPatient] = useState(patient)

    useEffect(() => {
        setLocalPatient(patient)
    }, [patient])


    const handleAvatarSaved = (newAvatarUrl) => {
        setLocalPatient((prev) => ({
            ...prev,
            avatar: { ...(prev?.avatar || {}), src: newAvatarUrl },
        }));
        setIsAvatarModalOpen(false);
    };

    console.log("src:", localPatient?.avatar?.src)

    return (
        <div className="min-h-screen max-w-7xl mx-auto w-full">
            <div className="flex gap-10 py-10">
                {/* Sidebar */}
                <aside>
                    <SidebarMenu
                        menu={sidebarMenu}
                        src={localPatient?.avatar?.src}
                        alt={localPatient?.avatar?.alt}
                        name={localPatient?.fullName}
                        activeKey={activeKey}
                        onChange={setActiveKey}
                        onLogout={onLogout}
                        isLoggingOut={isLoggingOut}
                        onEditAvatar={() => setIsAvatarModalOpen(true)}
                    />

                </aside>

                {/* Main cards and dashboard content */}
                <main className="flex-1 mt-15">
                    {activeKey === "personal" && <PatientInformation patient={patient} />}
                    {activeKey === "appointments" && <AppointmentsSection appointments={appointments} />}
                </main>
            </div>
            <Modal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
            >
                <AvatarCropper
                    onCancel={() => setIsAvatarModalOpen(false)}
                    onSave={handleAvatarSaved}
                />
            </Modal>
        </div>
    );
};

export default PatientProfileLayout;
