import avatar from '../assets/images/avatar-default.png'
import PersonalIcon from '../assets/icons/Profile_Icons/Personal.svg?react';
import Appointment from '../assets/icons/Profile_Icons/Appointment_icon.svg?react'
import Notification_icon from '../assets/icons/Profile_Icons/Notification.svg?react'
import Transaction from '../assets/icons/Profile_Icons/Transaction.svg?react'
import Wallet from "../assets/icons/Profile_Icons/Wallet.svg?react"
import Logout from '../assets/icons/Profile_Icons/Logout.svg?react'
import dashboard from "../assets/icons/Profile_Icons/dashboard.svg?react"
import patients from "../assets/icons/Profile_Icons/patients.svg?react"
import Publications from "../assets/icons/Profile_Icons/Publications.svg?react"


const adminProfileConfig = {
    avatar: {
        src: avatar,
        alt: "Profile picture"
    },
    sidebarMenu: [
        { key: "dashboard", label: "Your Dashboard", icon: dashboard },
        { key: "doctors", label: "Doctors", icon: PersonalIcon },
        { key: "patients", label: "Patients", icon: patients },
        { key: "appointments", label: "Appointments", icon: Appointment },
        { key: "publications", label: "Publications", icon: Publications },
        { key: "notifications", label: "Notification", icon: Notification_icon },
        { key: "transactions", label: "Transaction", icon: Transaction },
        { key: "revenue", label: "Revenue", icon: Wallet },
        { key: "logout", label: "Logout", icon: Logout }
    ],
};

export default adminProfileConfig;
