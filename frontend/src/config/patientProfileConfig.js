import avatar from '../assets/images/avatar-default.png'
import PersonalIcon from '../assets/icons/Profile_Icons/Personal.svg?react';
import Appointment from '../assets/icons/Profile_Icons/Appointment_icon.svg?react'
import Medical_records from '../assets/icons/Profile_Icons/Medical_records.svg?react'
import Notification_icon from '../assets/icons/Profile_Icons/Notification.svg?react'
import Transaction from '../assets/icons/Profile_Icons/Transaction.svg?react'
import Wallet from "../assets/icons/Profile_Icons/Wallet.svg?react"
import Settings from '../assets/icons/Profile_Icons/Settings.svg?react'
import Logout from '../assets/icons/Profile_Icons/Logout.svg?react'

const patientProfileConfig = {
    avatar: {
        src: avatar,
        alt: "Profile picture"
    },
    sidebarMenu: [
        { key: "personal", label: "Personal Information", icon: PersonalIcon },
        { key: "appointments", label: "My Appointments", icon: Appointment },
        { key: "records", label: "Medical Records", icon: Medical_records },
        { key: "notifications", label: "Notification", icon: Notification_icon },
        { key: "transactions", label: "Transaction", icon: Transaction },
        { key: "wallet", label: "Wallet", icon: Wallet },
        { key: "settings", label: "Account Settings", icon: Settings },
        { key: "logout", label: "Logout", icon: Logout }
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
