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
import department_icon from "../assets/icons/Profile_Icons/departments.svg?react"


const adminProfileConfig = {
    avatar: {
        src: avatar,
        alt: "Profile picture"
    },
    sidebarMenu: [
        { key: "dashboard", label: "Your Dashboard", icon: dashboard, path: "/admin/dashboard" },
        { key: "doctors", label: "Doctors", icon: PersonalIcon, path: "/admin/doctors" },
        { key: "patients", label: "Patients", icon: patients, path: "/admin/patients" },
        { key: "appointments", label: "Appointments", icon: Appointment, path: "/admin/appointments" },
        { key: "publications", label: "Publications", icon: Publications, path: "/admin/publications" },
        { key: "notifications", label: "Notification", icon: Notification_icon, path: "/admin/notifications" },
        { key: "departments", label: "Departments", icon: department_icon, path: "/admin/departments" },
        { key: "transactions", label: "Transaction", icon: Transaction, path: "/admin/transactions" },
        { key: "revenue", label: "Revenue", icon: Wallet, path: "/admin/revenue" },
        { key: "logout", label: "Logout", icon: Logout }
    ],
};

export default adminProfileConfig;
