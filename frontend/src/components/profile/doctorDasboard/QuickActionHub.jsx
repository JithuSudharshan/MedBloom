import { Link } from "react-router-dom";
import { Users, CalendarClock, CreditCard, Settings } from "lucide-react";

export default function QuickActionHub() {
    const actions = [
        { name: "My Patients", icon: Users, path: "/doctor/patients", color: "text-blue-600", bg: "bg-blue-50", hover: "hover:bg-blue-100" },
        { name: "Availability", icon: CalendarClock, path: "/doctor/availability", color: "text-emerald-600", bg: "bg-emerald-50", hover: "hover:bg-emerald-100" },
        { name: "Withdraw", icon: CreditCard, path: "/doctor/wallet", color: "text-amber-600", bg: "bg-amber-50", hover: "hover:bg-amber-100" },
        { name: "Settings", icon: Settings, path: "/doctor/personal", color: "text-slate-600", bg: "bg-slate-50", hover: "hover:bg-slate-100" }
    ];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(176,139,140,0.06)] border border-rose-50 h-full flex flex-col justify-center">
            <h3 className="text-gray-800 font-bold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.name}
                            to={action.path}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 group ${action.bg} ${action.hover} hover:-translate-y-0.5 hover:shadow-sm`}
                        >
                            <Icon className={`w-6 h-6 ${action.color} mb-2`} />
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{action.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
