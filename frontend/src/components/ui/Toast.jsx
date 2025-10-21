import { toast } from "sonner";

export const showToast = {
    success: (message) =>
        toast.success(message, {
            style: {
                background: "linear-gradient(to right, #00737A, #00C8C7)",
                color: "white",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 500,
                padding: "12px 16px",
                minHeight: "45px",
                display: "flex",
                alignItems: "center",
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
                background: "linear-gradient(to right, #00C9FF, #92FE9D)",
                color: "#003B3B",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 500,
                padding: "12px 16px",
                minHeight: "45px",
                display: "flex",
                alignItems: "center",
            },
            icon: "ℹ️",
            duration: 3000,
        }),
};
