import { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import PatientInformation from "./PatientInformation";
import AppointmentsSection from "./appointments/AppointmentsSection";
import Modal from "./Modal";
import AvatarCropper from "./AvatarCropper";
import DoctorInformation from "./DoctorInformation";
import NotificationsPage from "./NotificationsPage";
import DoctorOverview from "./doctorDasboard/DoctorOverview";

const ProfileLayout = ({
    user,
    sidebarMenu,
    profileData,
    appointments,
    onLogout,
    isLoggingOut,
    isActive
}) => {
    const [activeKey, setActiveKey] = useState(isActive)
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
    const [localUser, setLocalUser] = useState(profileData)

    useEffect(() => {
        setLocalUser(profileData)
    }, [profileData])


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
                        <DoctorOverview doctorName={localUser?.fullName} />
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
                    {activeKey === "appointments" && <AppointmentsSection appointments={appointments} />}
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
        </div>
    );
};

export default ProfileLayout;
