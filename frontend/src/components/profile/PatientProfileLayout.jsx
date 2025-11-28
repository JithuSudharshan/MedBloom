import { useState } from "react";
import SidebarMenu from "./SidebarMenu";
import PatientInformation from "./PatientInformation";
import AppointmentsSection from "./appointments/AppointmentsSection";

const PatientProfileLayout = ({
    avatar,
    sidebarMenu,
    patient,
    appointments,
    onLogout,
    isLoggingOut,
}) => {
    const [activeKey, setActiveKey] = useState("personal")

    return (
        <div className="min-h-screen max-w-7xl mx-auto w-full">
            <div className="flex gap-10 py-10">
                {/* Sidebar */}
                <aside>
                    <SidebarMenu
                        menu={sidebarMenu}
                        src={avatar.src}
                        alt={avatar.alt}
                        name={patient.fullName}
                        activeKey={activeKey}
                        onChange={setActiveKey}
                        onLogout={onLogout}
                        isLoggingOut={isLoggingOut}
                    />
                </aside>

                {/* Main cards and dashboard content */}
                <main className="flex-1 mt-15">
                    {activeKey === "personal" && <PatientInformation patient={patient} />}
                    {activeKey === "appointments" && <AppointmentsSection appointments={appointments} />}
                </main>
            </div>
        </div>
    );
};

export default PatientProfileLayout;
