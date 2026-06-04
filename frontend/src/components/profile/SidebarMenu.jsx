import { NavLink } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContex';

const SidebarMenu = ({ menu, src, alt, name, activeKey, onChange, onLogout, onEditAvatar, isAdmin = false, userRole = 'patient' }) => {
    const isDoctor = userRole === 'doctor';
    
    // For Notifications Badge
    const { notifications } = useNotifications() || { notifications: [] };
    const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

    return (
    <nav className="bg-white/80 backdrop-blur-md w-full rounded-[2.5rem] p-8 flex flex-col gap-2 relative z-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">

        <div className="flex flex-col items-center gap-3 py-6 shrink-0">
            <div className="relative">
                <img
                    src={src}
                    alt={alt}
                    className="rounded-full w-40 h-40 object-cover border-[4px] border-white shadow-sm relative z-10"
                />
                {!isAdmin && (<button
                    type="button"
                    onClick={onEditAvatar}
                    className="absolute bottom-1 right-1 flex items-center justify-center
                     w-9 h-9 rounded-full bg-white shadow-md border border-gray-200
                     hover:bg-gray-100 transition"
                >
                    {/*pencil icon using SVG*/}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.25 18.463 4.5 19.5l1.037-3.75L16.862 3.487z" />
                    </svg>
                </button>)}
            </div>
            <div className="font-medium text-lg text-gray-700">{name}</div>
        </div>


        <ul className={`flex flex-col gap-5 overflow-y-auto pr-2 
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            ${isDoctor ? "[&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-teal-100 hover:[&::-webkit-scrollbar-thumb]:bg-teal-200"}`}>
            {menu.map(item => {
                const Icon = item.icon;
                const isLogout = item.key === "logout";

                const baseStyles = "flex items-center gap-4 rounded-2xl px-5 py-4 w-full text-left transition-colors";

                if (isLogout) {
                    return (
                        <li key={item.key} className="pt-2">
                            <button
                                type="button"
                                onClick={onLogout}
                                className={`${baseStyles} text-gray-400 hover:bg-red-50 hover:text-red-600`}
                            >
                                {Icon && <Icon className="w-5 h-5" />}
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        </li>
                    );
                }

                return (
                    <li key={item.key}>
                        <NavLink
                            to={item.path || "#"}
                            end
                            className={({ isActive }) =>
                                `${baseStyles} ${
                                    isActive
                                        ? isDoctor 
                                            ? "bg-[#F8E9EA] text-[#6B3B3D] font-medium" 
                                            : "bg-[#EAFDFD] text-[#008C89] font-medium"
                                        : isDoctor
                                            ? "text-gray-500 hover:bg-rose-50/50 hover:text-[#B08B8C]"
                                            : "text-gray-500 hover:bg-teal-50/50 hover:text-teal-600"
                                }`
                            }
                        >
                            {Icon && <Icon className="w-5 h-5" />}
                            <span className="text-sm font-medium flex-1">{item.label}</span>
                            
                            {/* Notification Badge */}
                            {item.key === 'notifications' && unreadCount > 0 && (
                                <div className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in fade-in zoom-in duration-300">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </div>
                            )}
                        </NavLink>
                    </li>
                );
            })}
        </ul>
    </nav>
    );
};

export default SidebarMenu;
