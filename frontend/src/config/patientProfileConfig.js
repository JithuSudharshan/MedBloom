import avatar from '../assets/images/avatar-default.png'
import { User, Calendar, FileText, Bell, CreditCard, Wallet, Settings, LogOut } from 'lucide-react';

const patientProfileConfig = {
    avatar: {
        src: avatar,
        alt: "Profile picture"
    },
    sidebarMenu: [
        { key: "personal", label: "Personal Information", icon: User, path: "/patient/personal" },
        { key: "appointments", label: "My Appointments", icon: Calendar, path: "/patient/appointments" },
        { key: "records", label: "Medical Records", icon: FileText, path: "/patient/records" },
        { key: "notifications", label: "Notification", icon: Bell, path: "/patient/notifications" },
        { key: "transactions", label: "Transaction", icon: CreditCard, path: "/patient/transactions" },
        { key: "wallet", label: "Wallet", icon: Wallet, path: "/patient/wallet" },
        { key: "settings", label: "Account Settings", icon: Settings, path: "/patient/settings" },
        { key: "logout", label: "Logout", icon: LogOut }
    ],
    sections: [
        {
            title: "Basic Details",
            fields: [
                { label: "Full name", key: "fullName" },
                { label: "Email Address", key: "email" },
                { label: "Phone Number", key: "phone" },
                { label: "Date Of Birth", key: "dob" },
                { label: "Gender", key: "gender" },
                { label: "Address", key: "address" },
            ]
        },
        {
            title: "Medical Information",
            fields: [
                { label: "Blood Type", key: "bloodType" },
                { label: "Cholesterol", key: "cholesterol" },
                { label: "Height", key: "height" },
                { label: "Weight", key: "weight" },
                { label: "Blood Pressure", key: "bloodPressure" },
                { label: "Glucose Level", key: "glucoseLevel" },
                { label: "Allergies", key: "allergies" },
                { label: "Medical Condition", key: "medicalCondition" }
            ]
        }
    ],
    actions: [
        { label: "Change Password", variant: "secondary" },
        { label: "Edit Profile", variant: "primary" }
    ],
};

export default patientProfileConfig;
