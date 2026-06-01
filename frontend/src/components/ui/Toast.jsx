import { toast } from "sonner";

const isDoctorMode = () => {
    const path = window.location.pathname;
    const isPublicProfile = path.match(/^\/doctor\/[0-9a-fA-F]{24}$/);
    return path.includes('/doctor') && !isPublicProfile;
};

export const showToast = {
    success: (message) =>
        toast.success(message, {
            style: {
                background: isDoctorMode() ? "linear-gradient(to right, #6B3B3D, #B08B8C)" : "linear-gradient(to right, #00737A, #00C8C7)",
                color: "white",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 500,
                padding: "12px 16px",
                minHeight: "45px",
                display: "flex",
                alignItems: "center",
                boxShadow: isDoctorMode() ? "0 4px 12px rgba(176,139,140,0.2)" : "0 4px 12px rgba(0, 115, 122, 0.2)",
            },
            icon: "✅",
            duration: 3000,
        }),

    error: (message) =>
        toast.error(message, {
            style: {

                background: "#D32F2F",
                color: "white",
                borderRadius: "8px",
                fontSize: "1.0rem",
                fontWeight: 500,
                padding: "12px 16px",
                display: "flex",
                minHeight: "45px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            icon: "🚨",
            duration: 4000,
        }),
    info: (message) =>
        toast(message, {
            style: {
                background: isDoctorMode() ? "linear-gradient(to right, #FCF5F5, #F8E9EA)" : "linear-gradient(to right, #00C9FF, #92FE9D)",
                color: isDoctorMode() ? "#6B3B3D" : "#003B3B",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 500,
                padding: "12px 16px",
                minHeight: "45px",
                display: "flex",
                alignItems: "center",
                border: isDoctorMode() ? "1px solid #B08B8C" : "none",
            },
            icon: "ℹ️",
            duration: 3000,
        }),
};
